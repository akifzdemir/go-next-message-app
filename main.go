package main

import (
	"log"

	"example.com/go-htmx/config"
	"example.com/go-htmx/controllers"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()
	db := config.InitDB()
	uc := controllers.NewUserController(db)
	router.POST("/user", uc.Register)

	log.Fatal(router.Run(":8080"))
}
