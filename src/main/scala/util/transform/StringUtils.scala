package util.transform

object StringUtils {
  implicit val separator = "="

  implicit def string2Tuple(encodedPair: String)(implicit separator: String):Pair[String, String] = {
    val pair = encodedPair.split(separator)

    pair match {
      case p if p.length == 2 => p(0).trim -> p(1).trim
      case p if p.length == 1 => p(0).trim -> ""
    }
  }

  implicit def stringList2Map(encodedPairList: List[String]):Map[String, String] = {
    val aggregatorMap = new scala.collection.mutable.HashMap[String, String]    

    encodedPairList.map(string2Tuple(_)).map(aggregatorMap += _)

    Map[String, String]() ++ aggregatorMap  
  }

  implicit def toOption(str: String): Option[String] = str match {
    case s if s.trim.isEmpty => None
    case _ => Some(str)
  }
}