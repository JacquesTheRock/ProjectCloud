DBNAME=projectCloud
USER=jacques
DBCOMMAND="psql -U ${USER} -f"
DELDIR=delete
TABLEDIR=tables
POPDIR=info


usage() {
	echo "usage: ${0%//} [-h|--help] init|reinit|delete|table|info"
	echo -e "\t-h|--help) \n\t\tDisplay this message"
	echo -e "\tinit) \n\t\tCreate Database and populate with data"
	echo -e "\treinit) \n\t\tDelete then call init"
	echo -e "\tdelete) \n\t\tDeletes the tables"
	echo -e "\ttable) \n\t\tCreates tables with no data"
	echo -e "\tinfo) \n\t\tPopulates tables with default data"
}
info() {
	find ${POPDIR} -type f -name "*.sql" -exec ${DBCOMMAND} {} ${DBNAME} \;
}

table() {
	find ${TABLEDIR} -type f -name "*.sql" -exec ${DBCOMMAND} {} ${DBNAME} \;
}

delete() {
	find ${DELDIR} -type f -name "*.sql" -exec ${DBCOMMAND} {} ${DBNAME} \;
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
