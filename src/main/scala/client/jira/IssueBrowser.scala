package client.jira

import akka.actor.ActorSystem
import scala.concurrent.Future
import spray.http._
import spray.client.pipelining._
import spray.httpx.encoding.{Gzip, Deflate}
import spray.httpx.SprayJsonSupport._
import core.JiraResponse
import util.date.DateTime
import util.transform.json.DemonstratorProtocol._

//KTP AND resolution in (Unresolved, Fixed, Done) AND component in (Arrivals, Departures, Goldmine, Palladium, Radar, Staff-Finder) AND status = Closed AND updated >= 2013-07-12 AND updated <= 2013-07-29

case class IssueBrowser(projectName: String,
                        resolutionTypes: List[String],
                        components: List[String],
                        status: String,
                        springStart: DateTime,
                        springEnd: DateTime) {

  implicit val system = ActorSystem()
  import system.dispatcher // execution context for futures

  val pipeline: HttpRequest => Future[JiraResponse] = (
    addHeader("X-My-Special-Header", "fancy-value")
      ~> addCredentials(BasicHttpCredentials("jgonzalez", "dr@g0nl30th"))
      ~> encode(Gzip)
      ~> sendReceive
      ~> decode(Deflate)
      ~> unmarshal[JiraResponse]
    )

  val resolution = resolutionTypes.mkString(", ")
  val component = components.mkString(", ")
  val startDate = springStart.format
  val endDate = springEnd.format

  val queryBase = "https://jira.kaplan.com/rest/api/2/search?jql=project"
  val jqlQuery = Uri.from(s"$projectName AND resolution in ($resolution) AND component in ($component) AND status = $status AND updated >= $startDate AND updated <= $endDate")

  val response: Future[JiraResponse] =
    pipeline(Get("""https://jira.kaplan.com/rest/api/2/search?jql=project%20%3D%20KTP%20AND%20resolution%20in%20(Unresolved%2C%20Fixed%2C%20Done)%20AND%20component%20in%20(Arrivals%2C%20Departures%2C%20Goldmine%2C%20Palladium%2C%20Radar%2C%20Staff-Finder)%20AND%20status%20%3D%20Closed%20AND%20updated%20%3E%3D%202013-07-12%20AND%20updated%20%3C%3D%202013-07-29"""))


}
