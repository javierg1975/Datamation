package util.log

trait Loggeable{
	import org.slf4j._
	lazy val log = LoggerFactory.getLogger(super.getClass)

	def debug(message: Any){log.debug(message.toString)}

	def error(message: Any){log.error(message.toString)}

	def info(message: Any){log.info(message.toString)}

}	//trait