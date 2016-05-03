package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	_ "github.com/lib/pq" //Required for Postgres
	"nullandvoidgaming.com/projectCloud/item"
	"nullandvoidgaming.com/projectCloud/entity"

)

var config Configuration
var database *sql.DB

type DatabaseConnection struct {
	Host     string
	Port     int32
	Username string
	Password string
	Dbname   string
	URL      string
}

type Configuration struct {
	HTMLRoot string
	TemplateRoot string
	IP   string
	Port int64
	TimeFmt string
	ErrorFmt string
	DatasourceFile string
	DatabaseConnection DatabaseConnection
}

func (c *Configuration)GetURL() (string) {
	return c.IP + ":" + strconv.FormatInt(c.Port,10)
}

func (c Configuration)Pretty() (string) {
	return "Config:" +
		"\n\tHTMLRoot = " + c.HTMLRoot +
		"\n\tTemplateRoot = " + c.TemplateRoot +
		"\n\tIP = " + c.IP +
		"\n\tPort = " + strconv.FormatInt(c.Port,10) +
		"\n\tTimeFmt = " + c.TimeFmt +
		"\n\tErrorFmt = " + c.ErrorFmt +
		"\n\tDatasourceFile = " + c.DatasourceFile;
}

type PageMeta struct {
	Title  string
	Author string
}

func printError(a... interface{}) {
	fmtString := strings.Replace(config.ErrorFmt, "${time}", (time.Now()).Format(config.TimeFmt),1)
	fmtString = strings.Replace(fmtString, "${error}", "%s",1)
	fmt.Fprintf(os.Stderr, fmtString, a...)
}

func getDatabaseConnectionInfo(filename string) (DatabaseConnection, error) {
	file, err := os.Open(filename)
	if err != nil {
		printError(err.Error())
		return DatabaseConnection{}, err
	}

	var dbConfig DatabaseConnection
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&dbConfig)
	if err != nil {
		printError(err.Error())
		return DatabaseConnection{}, err
	}
	return dbConfig, nil
}

func readConfigurationInfo(filenames []string) (Configuration, error) {
	config = Configuration{ HTMLRoot: "html",
		TemplateRoot: "templates",
		Port: 8080,
		IP: "",
		TimeFmt: "2006 Jan 2 15:04:05",
		ErrorFmt: "${time}:\t${error}\n",
		DatasourceFile: "datasource.json" }
	out := config

	for i := 0; i < len(filenames); i++ {
		prechange := out
		file, err := os.Open(filenames[i])
		if err != nil {
			printError(err.Error())
			continue
		}
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&out)
		if err != nil {
			printError(err.Error())
			out = prechange
		}
	}
	out.ErrorFmt = strings.Replace(out.ErrorFmt, "%", "%%",-1)
	out.TimeFmt = strings.Replace(out.TimeFmt, "%", "%%",-1)
	return out,nil
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "A string")
}

func gemHandler(w http.ResponseWriter, r *http.Request) {
	head, _ := template.ParseFiles("templates/generic/header.templ")
	foot, _ := template.ParseFiles("templates/generic/footer.templ")
	t, _ := template.ParseFiles("templates/item/gem.templ")
	id, _ := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, _ := strconv.ParseInt(r.FormValue("tier"), 10, 8)
	results, err := searchGem(item.Gem{ID: id, Name: name, Tier: int8(tier), Description: description})
	if err != nil {
		printError(err.Error())
	}
	meta := PageMeta{Title: "Look up Gems!"}
	head.Execute(w, meta)
	t.Execute(w, results)
	foot.Execute(w, meta)
}
func bandHandler(w http.ResponseWriter, r *http.Request) {
	head, _ := template.ParseFiles("templates/generic/header.templ")
	foot, _ := template.ParseFiles("templates/generic/footer.templ")
	t, _ := template.ParseFiles("templates/item/band.templ")
	id, _ := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, _ := strconv.ParseInt(r.FormValue("tier"), 10, 8)
	results, err := searchBand(&item.Band{ID: id, Name: name, Tier: int8(tier), Description: description})
	if err != nil {
		printError(err.Error())
	}
	meta := PageMeta{Title: "Look up Bands!"}
	var search string
	if id != 0 {
		search= search + " id = " + r.FormValue("id")
	}
	if name != "" {
		search= search + " name = " + r.FormValue("name")
	}
	if tier != 0 {
		search= search + " tier = " + r.FormValue("tier")
	}
	head.Execute(w, meta)
	t.Execute(w, struct { Bands []item.Band; Search string }{ Bands: results, Search: search})
	foot.Execute(w, meta)
}

func enemyHandler(w http.ResponseWriter, r *http.Request) {
	head, _ := template.ParseFiles("templates/generic/header.templ")
	foot, _ := template.ParseFiles("templates/generic/footer.templ")
	t, _ := template.ParseFiles("templates/entity/enemy.templ")
	var e entity.Enemy
	e.ID, _ = strconv.ParseInt(r.FormValue("id"), 10, 64)
	e.Name = r.FormValue("name")
	results, err := searchEnemy(e)
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
	}
	meta := PageMeta{Title: "Look up Enemies!"}

	head.Execute(w,meta)
	t.Execute(w, struct {Enemies []entity.Enemy; Search string}{Enemies: results})
	foot.Execute(w,meta)
}

func apiReference(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles(config.HTMLRoot + "/api.html")
	t.Execute(w, nil)
}

func apiEnemySearch(w http.ResponseWriter, r *http.Request) {
	var e entity.Enemy
	var err error
	e.ID, err = strconv.ParseInt(r.FormValue("id"), 10, 64)
	e.Name = r.FormValue("name")
	results, err := searchEnemy(e)
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
		return
	}
	encoder := json.NewEncoder(w)
	encoder.Encode(results)
}

func apiPlayerSearch(w http.ResponseWriter, r *http.Request) {
	results, err := searchPlayer(entity.Player{ID: 1})
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
		return
	}
	encoder := json.NewEncoder(w)
	encoder.Encode(results)
}

func apiGemSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	id, err := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, err := strconv.ParseInt(r.FormValue("tier"), 10, 8)
	results, err := searchGem(item.Gem{ID: id, Name: name, Tier: int8(tier), Description: description})
	if err != nil {
		printError("Gem Search Failure")
		return
	}
	encoder.Encode(results)
}

func apiBandSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	id, _ := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, _ := strconv.ParseInt(r.FormValue("tier"), 10, 8)
	results, err := searchBand(&item.Band{ID: id, Name: name, Tier: int8(tier), Description: description})
	if err != nil {
		fmt.Println("Band Search Failure")
		return
	}
	encoder.Encode(results)
}

func apiRingSearch(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	id, _ := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	gemid, _ := strconv.ParseInt(r.FormValue("gemid"), 10, 64)
	bandid, _ := strconv.ParseInt(r.FormValue("bandid"), 10, 64)
	search := item.Ring{ID: id,
		Name: name,
		Gem:  item.Gem{ID: gemid},
		Band: item.Band{ID: bandid}}
	results, err := searchRing(search)
	if err != nil {
		fmt.Println("Ring Search failures")
		return
	}
	encoder.Encode(results)
}

func searchRing(r item.Ring) ([]item.Ring, error) {
	var output []item.Ring
	a := make([]interface{}, 0)
	query := "SELECT id,name,gem_id,band_id FROM ring"
	where := ""
	var count int64 = 0
	if r.Name != "" {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.Name)
		where = where + "name LIKE $" + strconv.FormatInt(count, 10)
	}
	if r.ID != 0 {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.ID)
		where = "id = $" + strconv.FormatInt(count, 10)
	}
	if r.Gem.ID != 0 {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.Gem.ID)
		where = "gem_id = $" + strconv.FormatInt(count, 10)
	}
	if r.Band.ID != 0 {
		if count > 0 {
			where = where + " AND "
		}
		count++
		a = append(a, r.Band.ID)
		where = "band_id = $" + strconv.FormatInt(count, 10)
	}
	if count > 0 {
		query = query + " WHERE " + where
	}
	rows, err := database.Query(query, a...)
	if err != nil {
		printError(err.Error())
		return output, err
	}
	for rows.Next() {
		var gemid int64
		var bandid int64
		var id int64
		var name string
		err := rows.Scan(&id, &name, &gemid, &bandid)
		if err != nil {
			printError(err.Error())
			continue
		}
		g, _ := searchGem(item.Gem{ID: gemid})
		b, _ := searchBand(&item.Band{ID: bandid})
		newRing := item.Ring{ID: id, Name: name, Gem: g[0], Band: b[0]}
		output = append(output, newRing)
	}
	return output, nil
}

func searchEnemy(e entity.Enemy) ([]entity.Enemy, error) {
	var output []entity.Enemy
	a := make([]interface{}, 0)
	query := "SELECT e.id, e.name " +
		",strength,agility,vitality " +
		",intelligence,wisdom,life " +
		"FROM enemy e,god g,god a WHERE " +
		"g.id = e.god_id AND " +
		"a.id = e.element_id "
	where := ""
	var count int64 = 0
	if e.Name != "" {
		count++
		a = append(a, e.Name)
		where = where + " AND e.name LIKE $" + strconv.FormatInt(count, 10)
	}
	if e.ID != 0 {
		count++
		a = append(a, e.ID)
		where = "AND e.id = $" + strconv.FormatInt(count, 10)
	}
	query = query + where
	rows, err := database.Query(query, a...)
	if err != nil {
		printError(err.Error())
		return output, err
	}
	for rows.Next() {
		var enemy entity.Enemy
		err := rows.Scan(&enemy.ID, &enemy.Name,
			&enemy.Strength, &enemy.Agility,
			&enemy.Vitality, &enemy.Intelligence,
			&enemy.Wisdom, &enemy.Life)
		if err != nil {
			printError(err.Error())
			continue
		}
		output = append(output, enemy)
	}
	return output, nil
}

func searchPlayer(p entity.Player) ([]entity.Player, error) {
	var output []entity.Player
	rows, err := database.Query("SELECT id, name, intelligence, strength, wisdom,"+
		"agility, life FROM player WHERE id LIKE $1", p.ID)
	if err != nil {
		printError(err.Error())
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var player entity.Player
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

func searchGem(g item.Gem) ([]item.Gem, error) {
	var output []item.Gem
	const qBase string = "SELECT id, name, description, tier FROM gem"
	var query string = qBase
	a := make([]interface{}, 0) //empty arg array
	if g.ID != 0 || g.Name != "" || g.Tier != 0 || g.Description != "" {
		query = query + " WHERE "
		var count int64 = 0
		if g.ID != 0 {
			a = append(a, g.ID)
			count++
			query = query + "id = $" + strconv.FormatInt(count, 10)
		}
		if g.Name != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, g.Name)
			count++
			query = query + "name LIKE $" +
				strconv.FormatInt(count, 10)
		}
		if g.Tier != 0 {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, g.Tier)
			count++
			query = query + "tier = $" + strconv.FormatInt(count, 10)
		}
		if g.Description != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, g.Description)
			count++
			query = query + "Description LIKE $" +
				strconv.FormatInt(count, 10)
		}
	}
	rows, err := database.Query(query, a...)
	if err != nil {
		fmt.Printf("Error in Execution: %s\n", err)
		fmt.Printf("Query Failed: %s with values: %s \n", query, a)
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var gem item.Gem
		err = rows.Scan(&gem.ID, &gem.Name, &gem.Description, &gem.Tier)
		if err != nil {
			fmt.Println(output)
		} else {
			output = append(output, gem)
		}
	}
	return output, nil
}

func searchBand(b *item.Band) ([]item.Band, error) {
	var output []item.Band
	const qBase string = "SELECT id, name, description, tier FROM band"
	var query string = qBase
	a := make([]interface{}, 0) //empty arg array
	if b != nil && b.ID != 0 || b.Name != "" || b.Tier != 0 || b.Description != "" {
		query = query + " WHERE "
		var count int64 = 0
		if b.ID != 0 {
			a = append(a, b.ID)
			count++
			query = query + "id = $" + strconv.FormatInt(count, 10)
		}
		if b.Name != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, b.Name)
			count++
			query = query + "name LIKE $" +
				strconv.FormatInt(count, 10)
		}
		if b.Tier != 0 {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, b.Tier)
			count++
			query = query + "tier = $" + strconv.FormatInt(count, 10)
		}
		if b.Description != "" {
			if count > 0 {
				query = query + " AND "
			}
			a = append(a, b.Description)
			count++
			query = query + "Description LIKE $" +
				strconv.FormatInt(count, 10)
		}
	}
	rows, err := database.Query(query, a...)
	if err != nil {
		fmt.Printf("Error in Execution: %s\n", err)
		fmt.Printf("Query Failed: %s with values: %s \n", query, a)
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var band item.Band
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
	configFiles := make([]string,0)
	configFiles = append(configFiles,"./config.json")
	config,_  = readConfigurationInfo(configFiles)
	var err error
	if config.DatasourceFile != "" {
		config.DatabaseConnection, err = getDatabaseConnectionInfo(config.DatasourceFile)
	}
	if err != nil {
		panic(fmt.Sprintf("Cannot read database info located at: %s", config.DatasourceFile))
	}
	if config.DatabaseConnection.URL == "" {
		config.DatabaseConnection.URL = fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", config.DatabaseConnection.Username, config.DatabaseConnection.Password, config.DatabaseConnection.Host, config.DatabaseConnection.Dbname)
		fmt.Printf("No URL Supplied, Deriving URL from parameters. %s\n", config.DatabaseConnection)
	} else {
		fmt.Printf("Database Using URL value, ignoring others\n")
	}
	database, err = sql.Open("postgres", config.DatabaseConnection.URL)
	if err != nil {
		panic(err)
	}
}

func main() {
	fmt.Println(config.Pretty())
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/gem/", gemHandler)
	http.HandleFunc("/band/", bandHandler)
	http.HandleFunc("/enemy/", enemyHandler)
	http.HandleFunc("/api/", apiReference)
	http.HandleFunc("/api/entity/enemy/", apiEnemySearch)
	http.HandleFunc("/api/entity/player/", apiPlayerSearch)
	http.HandleFunc("/api/item/gem/", apiGemSearch)
	http.HandleFunc("/api/item/band/", apiBandSearch)
	http.HandleFunc("/api/item/ring/", apiRingSearch)
	http.ListenAndServe(config.GetURL(), nil)
}
