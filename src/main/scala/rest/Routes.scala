package rest

import scala.concurrent.duration._
import akka.util.Timeout
import spray.http.StatusCodes._
import spray.http.MediaTypes._
import spray.json._
import spray.httpx.SprayJsonSupport
import scala.concurrent.Future
import concurrent.ExecutionContext.Implicits.global
import util.transform.json.DemonstratorProtocol._
import util.csv.CsvReader

trait Debugger {
  import org.slf4j._

  val log = LoggerFactory.getLogger("Debugger")
}

import akka.actor.{Props, Actor}
import akka.pattern.ask
import spray.routing.HttpService
import spray.routing.directives.CachingDirectives
import spray.http._
import dal.mongodb._
import core._



class DatamationServiceActor extends Actor with DeparturesService{
  def actorRefFactory = context
  def receive = runRoute(departuresRoute)
}

trait DeparturesService extends HttpService with SprayJsonSupport {

  implicit val timeout = Timeout(20 seconds)

  val departuresRoute = {
    pathPrefix(""){
      getFromDirectory("src/main/webapp/")
    }~
      path(""){
      respondWithMediaType(`text/html`){
        getFromFile("src/main/webapp/index.html")
      }
    }~
    pathPrefix("api"){
      issues("")/*~
      products("")*/

    }/*~
      pathPrefix("scripts"){
        getFromDirectory("target/scala-2.9.2/resource_managed/main/js/")
      }~
      pathPrefix("stylesheets"){
        getFromDirectory("target/scala-2.9.2/resource_managed/main/webapp/css/")
      }*/
  }



  private def issues(user: String) = {

    pathPrefix("upload"){
      path(""){
        post{
          entity(as[String]) { data =>
            val dataHandler = actorRefFactory.actorOf(Props[DataItemsDAO], name = "dataHandler")

            val ent = CsvReader(data).entries
            ent map{row=>
              dataHandler ! DataItem(row.head, row.tail.map{pair=>
                val (header, data) = pair
                (header, data.toInt)
              }.toVector)
            }

            actorRefFactory.stop(dataHandler)

            complete("Saving to db")
          }
        }
      }/*~
        get{
          parameter("projectName", "resolutionTypes", "components", "status", "springStart", "springEnd"){ (projectName, resolutionTypes, components, status, springStart, springEnd) =>

            val jiraResponse = (for {
              ss <- util.date.DateTime(springStart)
              se <- util.date.DateTime(springEnd)
            } yield IssueBrowser(projectName,
                resolutionTypes.split(",").toList,
                components.split(",").toList,
                status, ss, se).response).getOrElse(Future(JiraResponse(List.empty[Issue])))

            complete(jiraResponse)
          }
        }
      }~
        get{
          parameters("productId"){ ids =>
            complete((actor ? SearchByProduct(ids)).mapTo[Configurations])
          }
        }~
        get{
          parameter("moduleId"){ moduleId =>
            complete((actor ? ByModules(moduleId.split(",").toList)).mapTo[Results])
          }
        }*/
    } //pathPrefix
  } //def


  /*private def products(user: String) = {

    val actor = actorRefFactory.actorOf(Props(new ProductService(user)))
    pathPrefix("product"){
      path(Segment){(program) =>
        get{
          complete((actor ? SearchProductsByProgram(program)).mapTo[ProductResults])
        }
      }~
        get{
          parameters("id", "configurationId"){ (id, config) =>
            complete((actor ? ByProductId(id, config)).mapTo[Result])
          }
        }
    } //pathPrefix
  }*/ //def


} //trait
