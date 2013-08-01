package util

import akka.actor._

import akka.io.IO
import spray.can.Http
import rest.DatalizeServiceActor

object Boot extends App {

  // we need an ActorSystem to host our application in
  implicit val system = ActorSystem("on-spray-can")

  // create and start our service actor
  val service = system.actorOf(Props[DatalizeServiceActor], "datalize-service")

  val defaultPort = Option(System.getenv("PORT")).getOrElse("8080").toInt

  //start a new HTTP server on port 8080 with our service actor as the handler
  IO(Http) ! Http.Bind(service, "0.0.0.0", port = defaultPort)
}





