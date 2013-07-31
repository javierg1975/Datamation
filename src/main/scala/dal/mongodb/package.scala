package dal

import util.config._
import util.date.DateTime

package object mongodb{
  import com.mongodb.casbah._
  import commons.MongoDBObject

  trait MongoLabConnection {
    def url: String
    def port: Int
    def db: String
    def user: String
    def password: String

    def mongoDb = {
      val database = MongoConnection(url, port)(db)
      database.authenticate(user, password)
      database
    }
  }

  class MongoLabConnectionConfig(url: String, port: Int, db: String, user: String, password: String)

  // TODO: to be (at least partially) replaced by proper config file
  object DefaultMongoLabConnection extends MongoLabConnection {
    val url = Environment.load("MONGOLABS_URL")
    val port = Environment.load("MONGOLABS_PORT").toInt
    val db = Environment.load("MONGOLABS_DB")
    val user = Environment.load("MONGOLABS_USER")
    val password = Environment.load("MONGOLABS_PASSWORD")

    def apply(collectionName: String)= {
      mongoDb(collectionName)
    }
  }


  def using(collectionName: String) = DefaultMongoLabConnection(collectionName)

  object MongoLabsCollections{
    val dataItems = DefaultMongoLabConnection(Environment.load("DATAMATION_ENTRIES"))
  }


}