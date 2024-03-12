package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"uniqueIndex" json:"email"`
	UserName  string    `json:"username"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserResponse struct {
	gorm.Model
	Email    string
	UserName string
}

type UserRequest struct {
	Email    string
	UserName string
	Password string
}

type LoginRequest struct {
	Email    string
	Password string
}
