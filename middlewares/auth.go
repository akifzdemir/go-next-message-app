package middleware

import (
	"net/http"
	"strings"

	"example.com/go-htmx/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token must be provided"})
			c.Abort()
			return
		}

		claims, valid := utils.VerifyToken(token)
		if !valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unvalid Token"})
			c.Abort()
			return
		}

		c.Set("username", claims.Username)
		c.Next()
	}
}
