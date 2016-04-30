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

type Gem struct {
	ID int64
	Name string
	Description string
	Tier int8
}


type Band struct {
	ID int64
	Name string
	Description string
	Tier int8
}


type Ring struct {
	Gem Gem
	Band Band
	EquipEffect string
	SkillEffect string
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
	ID int64
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

func apiPlayerSearch(w http.ResponseWriter, r *http.Request) {
	results,err := searchPlayer(Player{ID: 1})
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
		return
	}
	encoder := json.NewEncoder(w)
	for i := 0; i < len(results); i++ {
		encoder.Encode(results)
	}
}

func apiGemSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	encoder.Encode(Gem{})
}

func apiBandSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	encoder.Encode(Band{})
}

func apiRingSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	encoder.Encode(Ring{})
}


func searchPlayer(p Player) ([]Player,error) {
	var output []Player
	rows, err := database.Query("SELECT id, name, intelligence, strength, wisdom," +
		"agility, life FROM player WHERE id = $1", p.ID)
	if err != nil {
		fmt.Println(err)
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var player Player
		err := rows.Scan(&player.ID, &player.Name, &player.Intelligence,
			&player.Strength, &player.Wisdom, &player.Agility, &player.Life)
		if err != nil{
			fmt.Println(err)
		} else {
			if cap(output) != len(output) {
				last := len(output)
				output = output[0:last + 1]
				output[last] =  player
			} else {
				break
			}
		}
	}
	return output, err
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
	http.HandleFunc("/api/entity/enemy/", apiEnemySearch)
	http.HandleFunc("/api/entity/player/", apiPlayerSearch)
	http.HandleFunc("/api/item/gem/", apiGemSearch)
	http.HandleFunc("/api/item/band/", apiBandSearch)
	http.HandleFunc("/api/item/ring/", apiRingSearch)
	http.ListenAndServe(":8080", nil)
}
