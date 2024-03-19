package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type Hub struct {
	Rooms      map[string]*Room
	Broadcast  chan *Message
	Register   chan *Client
	Unregister chan *Client
}

type Client struct {
	Id       string
	RoomId   string
	Username string
	Conn     *websocket.Conn
	Message  chan *Message
}

type Message struct {
	Content  string
	Username string
	RoomId   string
}

type Room struct {
	ID      string             `gorm:"primaryKey" json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `gorm:"-" json:"-"`
}

func (room *Room) BeforeCreate(tx *gorm.DB) (err error) {
	room.ID = uuid.NewString()
	return
}

type WsController struct {
	hub *Hub
	db  *gorm.DB
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan *Message, 5),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Rooms:      make(map[string]*Room),
	}
}

func NewWsController(h *Hub, db *gorm.DB) *WsController {
	return &WsController{
		hub: h,
		db:  db,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			if _, ok := h.Rooms[client.Id]; ok {
				r := h.Rooms[client.Id]
				if _, ok := r.Clients[client.Id]; !ok {
					r.Clients[client.Id] = client
				}
			}
		case client := <-h.Unregister:
			if _, ok := h.Rooms[client.Id]; ok {
				r := h.Rooms[client.Id]
				if _, ok := r.Clients[client.Id]; ok {
					delete(h.Rooms[client.Id].Clients, client.Id)
					close(client.Message)
				}
			}
		case m := <-h.Broadcast:
			if _, ok := h.Rooms[m.RoomId]; ok {
				for _, cl := range h.Rooms[m.RoomId].Clients {
					cl.Message <- m
				}
			}
		}

	}

}

func (c *Client) writeMessage() {
	defer func() {
		c.Conn.Close()
	}()
	for {
		message, ok := <-c.Message
		if !ok {
			return
		}
		c.Conn.WriteJSON(message)
	}
}

func (c *Client) readMessage(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		msg := &Message{
			Content:  string(message),
			RoomId:   c.RoomId,
			Username: c.Username,
		}

		hub.Broadcast <- msg
	}
}

func (wsc *WsController) CreateRoom(c *gin.Context) {
	var roomReq Room
	if err := c.ShouldBindJSON(&roomReq); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if err := wsc.db.Create(&roomReq).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	wsc.hub.Rooms[roomReq.ID] = &Room{
		ID:      roomReq.ID,
		Name:    roomReq.Name,
		Clients: make(map[string]*Client),
	}

	c.JSON(200, roomReq)
}

func (wsc *WsController) JoinRoom(c *gin.Context) {

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roomId := c.Param("roomId")
	userName := c.Query("username")
	userId := c.Query("userId")
	client := &Client{
		Id:       userId,
		RoomId:   roomId,
		Username: userName,
		Conn:     conn,
		Message:  make(chan *Message),
	}

	message := &Message{
		Content:  "A User has joined the room",
		Username: userName,
		RoomId:   roomId,
	}
	wsc.hub.Register <- client
	wsc.hub.Broadcast <- message
	go client.writeMessage()
	client.readMessage(wsc.hub)
}
