package main

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"fmt"
	"net/http"
	"os"

	_ "github.com/lib/pq" //Required for Postgres
)

var dbFile = "datasource.json"
var databaseConnection DatabaseConnection
var database *sql.DB

type DatabaseConnection struct {
	Host string
	Port int32
	Username string
	Password string
	Dbname string
	URL string
}

type Ring struct {
	Gem string
	Band string
	Effect string
}

type Equipment struct {
	LeftThumb Ring
	LeftIndex Ring
	LeftMiddle Ring
	LeftRing Ring
	LeftPinky Ring
	RightThumb Ring
	RightIndex Ring
	RightMiddle Ring
	RightRing Ring
	RightPinky Ring
}

type Player struct {
	Name string
	God string
	Affinity string
	Equipment Equipment
	Intelligence int32
	Strength int32
	Wisdom int32
	Agility int32
	Life int32
	Vitality int32
}

func getDatabaseConnectionInfo(filename string) (DatabaseConnection,error) {
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println(err.Error())
		return DatabaseConnection{}, err
	}

	var dbConfig DatabaseConnection
	decoder := json.NewDecoder(file)
	err  = decoder.Decode(&dbConfig)
	if err != nil {
		fmt.Println(err.Error())
		return DatabaseConnection{}, err
	}
	return dbConfig, nil
}


func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w,"A string")
}

func apiReference(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("html/api.html")
	t.Execute(w,nil)
}

func apiEnemySearch(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "A string")
}

func init() {
	databaseConnection, err := getDatabaseConnectionInfo(dbFile)
	if err != nil {
		panic(fmt.Sprintf("Cannot read database info located at: %s", dbFile))
	}
	if databaseConnection.URL == "" {
		databaseConnection.URL = fmt.Sprintf("postgres://%s:%s@%s/%s",databaseConnection.Username, databaseConnection.Password, databaseConnection.Host, databaseConnection.Dbname)
		fmt.Printf("No URL Supplied, Deriving URL from parameters. %s\n", databaseConnection)
	} else {
		fmt.Printf("Database Using URL value, ignoring others\n")
	}
	database, err = sql.Open("postgres", databaseConnection.URL)
	if err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/api",apiReference)
	http.ListenAndServe(":8080", nil)
}
