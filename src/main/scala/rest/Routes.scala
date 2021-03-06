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
import client.aws.S3Client

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



class DatalizeServiceActor extends Actor with DatalizeService{
  def actorRefFactory = context
  def receive = runRoute(departuresRoute)
}

trait DatalizeService extends HttpService  {

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
      dataUpload("")

    }/*~
      pathPrefix("scripts"){
        getFromDirectory("target/scala-2.9.2/resource_managed/main/js/")
      }~
      pathPrefix("stylesheets"){
        getFromDirectory("target/scala-2.9.2/resource_managed/main/webapp/css/")
      }*/
  }



  private def dataUpload(user: String) = {

    pathPrefix("upload"){
      post{
        path(""){
          entity(as[String]) { data =>
            //val dataHandler = actorRefFactory.actorOf(Props[DataItemsDAO])

            CsvReader(data).entries map{row=>
              actorRefFactory.actorOf(Props[DataItemsDAO]) ! DataItem(row.head, row.tail.map{pair=>
                val (header, data) = pair
                (header, data.toInt)
              }.toVector)
            }

            //actorRefFactory.stop(dataHandler)

            complete("Saving to db")
          }
        }~
          path("s3"){
            entity(as[Array[Byte]]) { data =>

              S3Client(data).save()


              complete("Saving to S3")
            }
          }
      }
    }
  }

}
