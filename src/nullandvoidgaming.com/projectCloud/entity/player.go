package entity

import (
	"nullandvoidgaming.com/projectCloud/item"
)

type Equipment struct {
	LeftThumb   item.Ring
	LeftIndex   item.Ring
	LeftMiddle  item.Ring
	LeftRing    item.Ring
	LeftPinky   item.Ring
	RightThumb  item.Ring
	RightIndex  item.Ring
	RightMiddle item.Ring
	RightRing   item.Ring
	RightPinky  item.Ring
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
