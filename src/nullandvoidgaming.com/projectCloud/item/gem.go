package item

import (
	"database/sql"
	"nullandvoidgaming.com/projectCloud/util"
	"strconv"
)

type Gem struct {
	ID          int64
	Name        string
	Description string
	Tier        int8
}

func SearchGem(g Gem, database *sql.DB) ([]Gem, error) {
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
		util.PrintError(err)
		util.PrintError("Query Failed")
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var gem Gem
		err = rows.Scan(&gem.ID, &gem.Name, &gem.Description, &gem.Tier)
		if err != nil {
			util.PrintError(output)
		} else {
			output = append(output, gem)
		}
	}
	return output, nil
}
