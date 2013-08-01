package dal.mongodb


import util.date._
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import akka.actor.{Props, Actor}
import akka.event.Logging
import akka.actor.ActorDSL._
import core.DataItem


object DataItemsDAO extends SalatDAO[DataItem, String](MongoLabsCollections.dataItems)

class DataItemsDAO extends Actor {
  def receive = {
    case di: DataItem => sender ! DataItemsDAO.save(di)
  }
}
