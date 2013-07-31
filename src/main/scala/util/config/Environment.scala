package util.config

object Environment{

	/**
 	* Looks for a system property in the environment. Throws an IllegalArgumentException
 	* if the value isn't defined in the environment.
 	* @param confProperty: String what system property to look for.
 	* @return String: the value loaded from the environment
 	*/
  def load(confProperty: String): String = {
  	scala.util.Properties.envOrNone(confProperty).
  	getOrElse(throw new IllegalArgumentException(
  		s"$confProperty could not be found in the system load"))
 	}	//def

 	/**
 	* Looks for a system property in the environment. Throws an IllegalArgumentException
 	* if the value isn't defined in the environment.
 	* @param property: Variables.Value what system property to look for.
  * @return String: the value loaded from the environment
 	*/
 	def apply(property: Variables.Value): String = load(property.toString)

 	object Variables extends Enumeration{
 		val KAPENGINE_HOST = Value
 		val KAPENGINE_BASEPATH = Value
 		val KAPENGINE_CATALOG = Value
 		val KAPENGINE_PORT = Value
 	}	//Variables

}	//object