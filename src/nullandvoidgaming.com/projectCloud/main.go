package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/lib/pq" //Required for Postgres
	"html/template"
	"net/http"
	"path/filepath"
	"nullandvoidgaming.com/projectCloud/entity"
	"nullandvoidgaming.com/projectCloud/item"
	"nullandvoidgaming.com/projectCloud/util"
	"strconv"
	"strings"
	"io/ioutil"
)

var config *util.Configuration
var database *sql.DB

type PageMeta struct {
	Title  string
	Author string
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	reqPath := strings.Split(r.URL.Path, "/")
	parsedPath := ""
	relocate :=  false
	for index,part := range reqPath {
		if(part != "") {
			parsedPath = filepath.Join(parsedPath,part)
		}
		if index == len(reqPath) - 1 {
			if strings.HasSuffix(part,".html") ||
				strings.HasSuffix(part,".css") ||
				strings.HasSuffix(part,".js") ||
				strings.HasSuffix(part,".png") ||
				strings.HasSuffix(part, ".ico"){
				continue
			}
			parsedPath =  filepath.Join(parsedPath,config.DefaultPage)
			relocate = true;
		}
	}
	parsedPath = filepath.Clean(parsedPath)
	file := filepath.Clean(config.HTMLRoot + "/" + parsedPath)
	safe := strings.HasPrefix(file,config.HTMLRoot)
	if safe {
		if relocate {
			w.Header().Set("Location", "/" + strings.Replace(parsedPath,"\\","/",-1))
			w.WriteHeader(http.StatusTemporaryRedirect)
			return
		}
		data, err := ioutil.ReadFile(file)
		if err != nil {
			util.PrintError(err.Error())
			fmt.Fprintf(w,"<html>%s</html>\n","404 Page not found")
			return
		}
		fmt.Fprintf(w,"%s",data)
		return
	}
	fmt.Fprintf(w,"<html>%s</html>\n","404 Page not found: Invalid Path")
}

func gemHandler(w http.ResponseWriter, r *http.Request) {
	head, _ := template.ParseFiles(config.TemplateRoot +
		"/generic/header.templ")
	foot, _ := template.ParseFiles(config.TemplateRoot +
		"/generic/footer.templ")
	t, _ := template.ParseFiles(config.TemplateRoot +
		"/item/gem.templ")
	id, _ := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, _ := strconv.ParseInt(r.FormValue("tier"), 10, 8)
	results, err := item.SearchGem(item.Gem{ID: id, Name: name, Tier: int8(tier), Description: description}, database)
	if err != nil {
		util.PrintError(err.Error())
	}
	var search string = ""
	if id != 0 {
		search = search + "id = " + r.FormValue("id") + " "
	}
	if name != "" {
		search = search + "name = " + r.FormValue("name") + " "
	}
	if description != "" {
		search = search + "description = " +
			r.FormValue("description") + " "
	}
	if tier != 0 {
		search = search + "tier = " + r.FormValue("tier") + " "
	}
	meta := PageMeta{Title: "Look up Gems!"}
	head.Execute(w, meta)
	t.Execute(w, struct {
		Gems   []item.Gem
		Search string
	}{Gems: results, Search: search})
	foot.Execute(w, meta)
}
func bandHandler(w http.ResponseWriter, r *http.Request) {
	head, _ := template.ParseFiles(config.TemplateRoot + "/generic/header.templ")
	foot, _ := template.ParseFiles(config.TemplateRoot + "/generic/footer.templ")
	t, _ := template.ParseFiles(config.TemplateRoot + "/item/band.templ")
	id, _ := strconv.ParseInt(r.FormValue("id"), 10, 64)
	name := r.FormValue("name")
	description := r.FormValue("description")
	tier, _ := strconv.ParseInt(r.FormValue("tier"), 10, 8)
	results, err := item.SearchBand(&item.Band{ID: id, Name: name, Tier: int8(tier), Description: description}, database)
	if err != nil {
		util.PrintError(err.Error())
	}
	meta := PageMeta{Title: "Look up Bands!"}
	var search string
	if id != 0 {
		search = search + " id = " + r.FormValue("id")
	}
	if name != "" {
		search = search + " name = " + r.FormValue("name")
	}
	if tier != 0 {
		search = search + " tier = " + r.FormValue("tier")
	}
	head.Execute(w, meta)
	t.Execute(w, struct {
		Bands  []item.Band
		Search string
	}{Bands: results, Search: search})
	foot.Execute(w, meta)
}

func enemyHandler(w http.ResponseWriter, r *http.Request) {
	head, _ := template.ParseFiles(config.TemplateRoot +
		"/generic/header.templ")
	foot, _ := template.ParseFiles(config.TemplateRoot +
		"/generic/footer.templ")
	t, _ := template.ParseFiles(config.TemplateRoot +
		"/entity/enemy.templ")
	var e entity.Enemy
	e.ID, _ = strconv.ParseInt(r.FormValue("id"), 10, 64)
	e.Name = r.FormValue("name")
	results, err := entity.SearchEnemy(e, database)
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
	}
	meta := PageMeta{Title: "Look up Enemies!"}

	head.Execute(w, meta)
	t.Execute(w, struct {
		Enemies []entity.Enemy
		Search  string
	}{Enemies: results})
	foot.Execute(w, meta)
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
	results, err := entity.SearchEnemy(e, database)
	if err != nil {
		fmt.Printf("Player Search Failure: %s", err)
		return
	}
	encoder := json.NewEncoder(w)
	encoder.Encode(results)
}

func apiPlayerSearch(w http.ResponseWriter, r *http.Request) {
	results, err := entity.SearchPlayer(entity.Player{ID: 1}, database)
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
	results, err := item.SearchGem(item.Gem{ID: id, Name: name, Tier: int8(tier), Description: description}, database)
	if err != nil {
		util.PrintError("Gem Search Failure")
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
	results, err := item.SearchBand(&item.Band{ID: id, Name: name, Tier: int8(tier), Description: description}, database)
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
	results, err := item.SearchRing(search, database)
	if err != nil {
		fmt.Println("Ring Search failures")
		return
	}
	encoder.Encode(results)
}

func init() {
	configFiles := make([]string, 0)
	configFiles = append(configFiles, "./config.json")
	config = &util.Config
	(*config), _ = util.ReadConfigurationInfo(configFiles)
	var err error
	if config.DatasourceFile != "" {
		config.DatabaseConnection, err = util.GetDatabaseConnectionInfo(config.DatasourceFile)
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
	fmt.Println(util.Config.Pretty())
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
