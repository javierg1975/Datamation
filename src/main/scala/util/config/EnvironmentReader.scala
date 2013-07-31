package util.config

object EnvironmentReader{

	/**
 	* Looks for a system property in the environment. Throws an IllegalArgumentException
 	* if the value isn't defined in the environment.
 	* @param confProperty: String what system property to look for.
 	* @return String the value of the environment
 	*/
  def environment(confProperty: String): String = {
  	scala.util.Properties.envOrNone(confProperty).
  	getOrElse(throw new IllegalArgumentException(
  		s"$confProperty could not be found in the system environment"))
 	}	//def

 	/**
 	* Looks for a system property in the environment. Throws an IllegalArgumentException
 	* if the value isn't defined in the environment.
 	* @param property: Variables.Value what system property to look for.
 	* @return String the value of the environment
 	*/
 	def apply(property: Variables.Value): String = environment(property.toString)

 	object Variables extends Enumeration{
 		val KAPENGINE_HOST = Value
 		val KAPENGINE_BASEPATH = Value
 		val KAPENGINE_CATALOG = Value
 		val KAPENGINE_PORT = Value
 	}	//Variables

}	//object