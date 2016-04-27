DBNAME=projectCloud
USER=jacques
DBCOMMAND="psql -U ${USER} -f"
DELDIR=delete
TABLEDIR=tables
POPDIR=info
files='god.sql ring.sql player.sql'


usage() {
	echo "usage: ${0%//} [-h|--help] init|reinit|delete|table|info"
	echo -e "\t-h|--help) \n\t\tDisplay this message"
	echo -e "\tinit) \n\t\tCreate Database and populate with data"
	echo -e "\treinit) \n\t\tDelete then call init"
	echo -e "\tdelete) \n\t\tDeletes the tables"
	echo -e "\ttable) \n\t\tCreates tables with no data"
	echo -e "\tinfo) \n\t\tPopulates tables with default data"
}
runscripts() {
	local scriptDir=$1
	for file in $files; do
		${DBCOMMAND} ${scriptDir}/$file ${DBNAME} ;
	done
}

info() {
	runscripts "${POPDIR}"
}

table() {
	runscripts "${TABLEDIR}"
}

delete() {
	runscripts "${DELDIR}"
}

init() {
	table
	info
}


#preprocess
while [ $# -gt 0 ]; do
	case $1 in
		init)
			action=init
		;;
		reinit)
			action=reinit
		;;
		info)
			action=info
		;;
		table)
			action=table
		;;
		delete)
			action=delete
		;;
		-h|--help)
			usage
			exit 0
		;;
		*)
			echo "invalid option: $1" 1>&2
			usage
			exit 1
		;;
	esac
	shift
done

if [ -z $action ]; then
	usage
	exit 1
fi

case $action in
	init)
		init
	;;
	reinit)
		delete
		init
	;;
	info)
		info
	;;
	table)
		table
	;;
	delete)
		delete
	;;
	*)
		echo "Code Error? Invalid action"
		exit 2
	;;
esac
