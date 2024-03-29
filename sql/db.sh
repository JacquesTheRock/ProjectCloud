DBNAME=projectcloud
DBADMIN=projcloudadmin
DBCLIENT=projcloudclient
DBCOMMAND="psql -U ${DBADMIN} -f"
DELDIR=delete
TABLEDIR=tables
POPDIR=info
PERMDIR=perm
files='god.sql ring.sql player.sql enemy.sql'


usage() {
	echo "usage: ${0%//} [-h|--help] init|reinit|delete|table|info"
	echo -e "\t-h|--help) \n\t\tDisplay this message"
	echo -e "\tinit) \n\t\tCreate Database and populate with data"
	echo -e "\treinit) \n\t\tDelete then call init"
	echo -e "\tdelete) \n\t\tDeletes the tables"
	echo -e "\tclean) \n\t\tDeletes generated sql files"
	echo -e "\ttable) \n\t\tCreates tables with no data"
	echo -e "\tinfo) \n\t\tPopulates tables with default data"
}
runscripts() {
	local scriptDir=$1
	for file in $files; do
		${DBCOMMAND} ${scriptDir}/$file ${DBNAME} ;
	done
}

genscripts() {
	local scriptDir=$1
	for file in $files; do
		file="${scriptDir}/${file}"
		sed "s/||clientuser||/${DBCLIENT}/g" ${file%%.sql}.p > ${file}
	done
}

clean() {
	for file in $files; do
		rm -v {"${POPDIR}","${TABLEDIR}","${DELDIR}","${PERMDIR}"}/$file
	done
}

info() {
	genscripts "${POPDIR}"
	runscripts "${POPDIR}"
}

table() {
	genscripts "${TABLEDIR}"
	runscripts "${TABLEDIR}"
}

delete() {
	genscripts "${DELDIR}"
	runscripts "${DELDIR}"
}

permissions() {
	genscripts "${PERMDIR}"
	runscripts "${PERMDIR}"
}


init() {
	table
	info
	permissions
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
		clean)
			action=clean
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
		clean
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
	clean)
		clean
	;;
	*)
		echo "Code Error? Invalid action"
		exit 2
	;;
esac
