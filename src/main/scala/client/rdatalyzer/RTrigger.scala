package client.rdatalyzer

import akka.actor.ActorSystem
import scala.concurrent.Future
import spray.http._
import spray.client.pipelining._
import spray.httpx.encoding.{Gzip, Deflate}
import spray.httpx.SprayJsonSupport._

class RTrigger(trigger: String) {
  implicit val system = ActorSystem()
  import system.dispatcher // execution context for futures

  val pipeline: HttpRequest => Future[String] = (
    addHeader("X-My-Special-Header", "fancy-value")
      ~> encode(Gzip)
      ~> sendReceive
      ~> decode(Deflate)
      ~> unmarshal[String]
    )

  val response: Future[String] = pipeline(Post("https://something/", trigger))


}
