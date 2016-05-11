package item

import (
	"database/sql"
	"nullandvoidgaming.com/projectCloud/util"
	"strconv"
)

type Band struct {
	ID          int64
	Name        string
	Description string
	Tier        int8
}

func SearchBand(b *Band, database *sql.DB) ([]Band, error) {
	var output []Band
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
		util.PrintError(err)
		util.PrintError("Query Failed")
		return output, err
	}
	defer rows.Close()
	for rows.Next() {
		var band Band
		err = rows.Scan(&band.ID, &band.Name, &band.Description, &band.Tier)
		if err != nil {
			util.PrintError(output)
		} else {
			output = append(output, band)
		}
	}
	return output, nil
}
