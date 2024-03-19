package config

import (
	"log"

	"example.com/go-htmx/controllers"
	"example.com/go-htmx/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	dbURL := "postgres://postgres:1234@localhost:5432/go-htmx"

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&controllers.Room{})

	return db
}
