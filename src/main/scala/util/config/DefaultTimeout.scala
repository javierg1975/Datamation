package util.config
import akka.util.Timeout

trait DefaultTimeout {
  final val timeoutValue = 10000
  final implicit val timeout = Timeout(timeoutValue)

}