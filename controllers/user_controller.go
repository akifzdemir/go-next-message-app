package controllers

import (
	"example.com/go-htmx/models"
	"example.com/go-htmx/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{
		DB: db,
	}
}

func (uc *UserController) Register(c *gin.Context) {

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	bytes, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	user.Password = string(bytes)

	if err := uc.DB.Create(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create user"})
		return
	}
	c.JSON(201, gin.H{"user created: ": user})
}

func (uc *UserController) GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := uc.DB.Where("id = ? ", id).First(&user).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	c.JSON(200, user)
}

func (uc *UserController) GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := uc.DB.Find(&users).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, users)

}

func (uc *UserController) Login(c *gin.Context) {
	var loginRequest models.LoginRequest
	var user models.User

	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := uc.DB.Where("email = ? ", loginRequest.Email).First(&user).Error; err != nil {
		c.JSON(404, gin.H{"error": "User Not found"})
		return
	}
	passwordErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
	if passwordErr != nil {
		c.JSON(400, gin.H{"error": passwordErr.Error()})
		return
	}
	token, _ := utils.GenerateToken(user.UserName)
	c.JSON(200, gin.H{"token": token})
}
