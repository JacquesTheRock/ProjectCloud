package item

import(
	"database/sql"
	"strconv"
	"nullandvoidgaming.com/projectCloud/util"
)

type Ring struct {
	ID          int64
	Name        string
	Gem         Gem
	Band        Band
	EquipEffect string
	SkillEffect string
}

func SearchRing(r Ring, database *sql.DB) ([]Ring, error) {
       var output []Ring
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
               util.PrintError(err.Error())
               return output, err
       }
       for rows.Next() {
               var gemid int64
               var bandid int64
               var id int64
               var name string
               err := rows.Scan(&id, &name, &gemid, &bandid)
               if err != nil {
                       util.PrintError(err.Error())
                       continue
               }
               g, _ := SearchGem(Gem{ID: gemid},database)
               b, _ := SearchBand(&Band{ID: bandid},database)
               newRing := Ring{ID: id, Name: name, Gem: g[0], Band: b[0]}
               output = append(output, newRing)
       }
       return output, nil
}

