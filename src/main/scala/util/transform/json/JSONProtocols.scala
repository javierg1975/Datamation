package util.transform.json

import spray.json._



import util.date.DateTime
import org.bson.types.ObjectId
import core._

object DemonstratorProtocol extends DefaultJsonProtocol {
  implicit object ObjectIdJsonFormat extends JsonFormat[ObjectId]{
    def write(_id: ObjectId) = JsString(_id.toString)
    def read(value: JsValue) = new ObjectId(value.toString.replaceAll("\"", ""))
  }

  implicit object DateTimeJsonFormat extends RootJsonFormat[DateTime] {
    def write(dt: DateTime) = JsString(dt.formatAs("MM/dd/yy"))

    def read(value: JsValue) = {
      value match {
        case JsString(dateStr) => {
          try {
            DateTime.fromString(dateStr).getOrElse(throw new DeserializationException("Can not recognize a Date string format"))
          } catch  {
            case tpe: java.text.ParseException => try {
              DateTime.fromString(dateStr, guessPartial= true).getOrElse(throw new DeserializationException("Can not recognize a Date string format"))
            }
          }
        }
        case _ =>  throw new DeserializationException("Date string expected")
      }
    }
  }

  implicit var projectFormat = jsonFormat4(Project)

  implicit var componentFormat = jsonFormat3(Component)

  implicit var fieldFormat = jsonFormat3(FieldDescriptor)

  implicit var issueFormat = jsonFormat4(Issue)

  implicit var jiraFormat = jsonFormat1(JiraResponse)





}