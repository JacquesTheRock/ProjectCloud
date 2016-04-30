package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strconv"

	_ "github.com/lib/pq" //Required for Postgres
)

var dbFile = "datasource.json"
var databaseConnection DatabaseConnection
var database *sql.DB

type DatabaseConnection struct {
	Host     string
	Port     int32
	Username string
	Password string
	Dbname   string
	URL      string
}

type Gem struct {
	ID          int64
	Name        string
	Description string
	Tier        int8
}

type Band struct {
	ID          int64
	Name        string
	Description string
	Tier        int8
}

type Ring struct {
	ID          int64
	Name        string
	Gem         Gem
	Band        Band
	EquipEffect string
	SkillEffect string
}

type Equipment struct {
	LeftThumb   Ring
	LeftIndex   Ring
	LeftMiddle  Ring
	LeftRing    Ring
	LeftPinky   Ring
	RightThumb  Ring
	RightIndex  Ring
	RightMiddle Ring
	RightRing   Ring
	RightPinky  Ring
}

type Player struct {
	ID           int64
	Name         string
	God          string
	Affinity     string
	Equipment    Equipment
	Intelligence int32
	Strength     int32
	Wisdom       int32
	Agility      int32
	Life         int32
	Vitality     int32
}

func getDatabaseConnectionInfo(filename string) (DatabaseConnection, error) {
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println(err.Error())
		return DatabaseConnection{}, err
	}

	var dbConfig DatabaseConnection
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&dbConfig)
	if err != nil {
		fmt.Println(err.Error())
		return DatabaseConnection{}, err
	}
	return dbConfig, nil
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "A string")
}

func apiReference(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("html/api.html")
	t.Execute(w, nil)
}

func apiEnemySearch(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "A string")
}

func apiPlayerSearch(w http.ResponseWriter, r *http.Request) {
	results, err := searchPlayer(Player{ID: 1})
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
		return
	}
	encoder := json.NewEncoder(w)
	for i := 0; i < len(results); i++ {
		encoder.Encode(results[i])
	}
}

func apiGemSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	id,err := strconv.ParseInt(r.FormValue("id"),10,64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, err := strconv.ParseInt(r.FormValue("tier"),10,8)
	results, err := searchGem(Gem{ID: id, Name: name, Tier: int8(tier), Description: description})
	if err != nil {
		fmt.Println("Gem Search Failure")
		return
	}
	encoder.Encode(results)
}

func apiBandSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	id,_ := strconv.ParseInt(r.FormValue("id"),10,64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier,_ := strconv.ParseInt(r.FormValue("tier"),10,8)
	results, err := searchBand(Band{ID: id, Name: name, Tier: int8(tier), Description: description})
	if err != nil {
		fmt.Println("Band Search Failure")
		return
	}
	encoder.Encode(results)
}

func apiRingSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	id,_ := strconv.ParseInt(r.FormValue("id"),10,64)
	name := r.FormValue("name")
	gemid,_ := strconv.ParseInt(r.FormValue("gemid"),10,64)
	bandid,_ := strconv.ParseInt(r.FormValue("bandid"),10,64)
	search := Ring{ID: id,
		Name: name,
		Gem: Gem{ID: gemid},
		Band: Band{ID: bandid}}
	results, err := searchRing(search)
	if err != nil {
		fmt.Println("Ring Search failures")
		return
	}
	encoder.Encode(results)
}

func searchRing(r Ring) ([]Ring,error) {
	var output []Ring
	a := make([]interface{},0)
	query :=  "SELECT id,name,gem_id,band_id FROM ring"
	where := ""
	var count int64 = 0
	if r.Name != "" {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.Name)
		where = where + "name LIKE $" + strconv.FormatInt(count,10)
	}
	if r.ID != 0 {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.ID)
		where = "id = $" + strconv.FormatInt(count,10)
	}
	if r.Gem.ID != 0 {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.Gem.ID)
		where = "gem_id = $" + strconv.FormatInt(count,10)
	}
	if r.Band.ID != 0 {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.Band.ID)
		where = "band_id = $" + strconv.FormatInt(count,10)
	}
	if count > 0 {
		query = query + " WHERE " + where
	}
	rows, err := database.Query(query,a...)
	if err != nil {
		fmt.Println(err);
		return output, err
	}
	for rows.Next() {
		var gemid int64
		var bandid int64
		var id int64
		var name string
		err := rows.Scan(&id, &name, &gemid, &bandid)
		if err != nil {
			fmt.Println(err)
			continue
		}
		g,_ := searchGem(Gem{ID: gemid})
		b,_ := searchBand(Band{ID: bandid})
		newRing := Ring{ ID: id, Name: name, Gem: g[0], Band: b[0]}
		output = append(output, newRing)
	}
	return output, nil
}


func searchPlayer(p Player) ([]Player, error) {
	var output []Player
	rows, err := database.Query("SELECT id, name, intelligence, strength, wisdom,"+
		"agility, life FROM player WHERE id LIKE $1", p.ID)
	if err != nil {
		fmt.Println(err)
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var player Player
		err := rows.Scan(&player.ID, &player.Name, &player.Intelligence,
			&player.Strength, &player.Wisdom, &player.Agility, &player.Life)
		if err != nil {
			fmt.Println(output)
		} else {
			if cap(output) != len(output) {
				last := len(output)
				output = output[0 : last+1]
				output[last] = player
			} else {
				break
			}
		}
	}
	return output, nil
}

func searchGem(g Gem) ([]Gem, error) {
	var output []Gem
	const qBase string = "SELECT id, name, description, tier FROM gem"
	var query string = qBase
	a := make([]interface{}, 0) //empty arg array
	if g.ID != 0 || g.Name != "" || g.Tier != 0 || g.Description != "" {
		query = query + " WHERE "
		var count int64 = 0
		if g.ID != 0 {
			a = append(a, g.ID)
			count++
			query = query + "id = $" + strconv.FormatInt(count,10)
		}
		if g.Name != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, g.Name)
			count++
			query = query + "name LIKE $" +
				strconv.FormatInt(count,10)
		}
		if g.Tier != 0 {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, g.Tier)
			count++
			query = query + "tier = $" + strconv.FormatInt(count,10)
		}
		if g.Description != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a,g.Description)
			count++
			query = query + "Description LIKE $" +
				strconv.FormatInt(count,10)
		}
	}
	rows, err := database.Query(query,a...)
	if err != nil {
		fmt.Printf("Error in Execution: %s\n", err)
		fmt.Printf("Query Failed: %s with values: %s \n",query, a)
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var gem Gem
		err = rows.Scan(&gem.ID, &gem.Name, &gem.Description, &gem.Tier)
		if err != nil {
			fmt.Println(output)
		} else {
			output = append(output, gem)
		}
	}
	return output, nil
}

func searchBand(b Band) ([]Band, error) {
	var output []Band
	const qBase string = "SELECT id, name, description, tier FROM band"
	var query string = qBase
	a := make([]interface{}, 0) //empty arg array
	if b.ID != 0 || b.Name != "" || b.Tier != 0 || b.Description != "" {
		query = query + " WHERE "
		var count int64 = 0
		if b.ID != 0 {
			a = append(a, b.ID)
			count++
			query = query + "id = $" + strconv.FormatInt(count,10)
		}
		if b.Name != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, b.Name)
			count++
			query = query + "name LIKE $" +
				strconv.FormatInt(count,10)
		}
		if b.Tier != 0 {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, b.Tier)
			count++
			query = query + "tier = $" + strconv.FormatInt(count,10)
		}
		if b.Description != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a,b.Description)
			count++
			query = query + "Description LIKE $" +
				strconv.FormatInt(count,10)
		}
	}
	rows, err := database.Query(query,a...)
	if err != nil {
		fmt.Printf("Error in Execution: %s\n", err)
		fmt.Printf("Query Failed: %s with values: %s \n",query, a)
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var band Band
		err = rows.Scan(&band.ID, &band.Name, &band.Description, &band.Tier)
		if err != nil {
			fmt.Println(output)
		} else {
			output = append(output, band)
		}
	}
	return output, nil
}

func init() {
	databaseConnection, err := getDatabaseConnectionInfo(dbFile)
	if err != nil {
		panic(fmt.Sprintf("Cannot read database info located at: %s", dbFile))
	}
	if databaseConnection.URL == "" {
		databaseConnection.URL = fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", databaseConnection.Username, databaseConnection.Password, databaseConnection.Host, databaseConnection.Dbname)
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
	http.HandleFunc("/api", apiReference)
	http.HandleFunc("/api/entity/enemy/", apiEnemySearch)
	http.HandleFunc("/api/entity/player/", apiPlayerSearch)
	http.HandleFunc("/api/item/gem/", apiGemSearch)
	http.HandleFunc("/api/item/band/", apiBandSearch)
	http.HandleFunc("/api/item/ring/", apiRingSearch)
	http.ListenAndServe(":8080", nil)
}
