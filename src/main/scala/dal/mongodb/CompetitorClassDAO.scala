package dal.mongodb

/*
import util.date._
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import akka.actor.{Props, Actor}

import akka.event.Logging
import java.util.UUID


object ClassHistoryDAO extends SalatDAO[ClassDelta, ObjectId](MongoLabsCollections.competitorClassHistory)

case object DataDump

class ClassHistoryDAO extends Actor {
  def receive = {
    case cd: ClassDelta => {
      if (!cd.isEmpty)
        ClassHistoryDAO.insert(cd)
    }

    case id: Long => sender ! ClassHistoryDAO.find(ref = MongoDBObject("classId" -> id)).toList
    case DataDump => sender ! ClassHistoryDAO.find(ref = MongoDBObject.empty).toList
  }
}

object DeferredAddressDAO extends SalatDAO[WebQlEntry, ObjectId](MongoLabsCollections.deferredAddresses)

class DeferredAddressDAO extends Actor {
  import context._

  val log = Logging(context.system, this)


  def receive = {
    case LoadDeferredAddresses(competitor, program) => {
      val addrList = DeferredAddressDAO.find(ref = MongoDBObject("competitorName" -> competitor, "programName" -> program)).toList
      sender ! addrList.map{entry =>
        AddressResult(entry.id.toString, entry.originalAddress.addr.getOrElse("N/A"), entry.originalAddress.zip.getOrElse("N/A"))
      }
    }
    case m: ListWebQLJobs => {
      // TODO we should be able to replace most of this code by proper MongoDB queries once we move to 2.1+ (can't do it right now because of port restrictions)

      // FIX -> right now we're pulling the entire database so we can group and count. This could be made on the query itself once we move to 2.1+
      val competitorGroup = DeferredAddressDAO.find(MongoDBObject.empty).toList.groupBy(_.competitorName)

      object DateOrdering extends Ordering[DateTime] { def compare(d1: DateTime, d2: DateTime) = d1.compare(d2) }

      val programsByCompetitor = competitorGroup.mapValues(_.groupBy(_.programName))

      val workUnitStats = programsByCompetitor.map { competitorEntry =>

        val (competitor, programGroups) = competitorEntry

        programGroups.map{programEntry =>
          val (program, entryList) = programEntry
          WebQLWorkUnit(competitor + "-" +  program, competitor, program, entryList.size, entryList.max.lastUpdated)
        }

      }.flatten.toList

      sender ! WebQLReport(workUnitStats)

    }

    case LoadClassesForAddress(entryId) => {
      DeferredAddressDAO.findOneById(new ObjectId(entryId)).map {entry =>
        sender ! entry.relatedClasses
      }
    }

    case UpdatedAddress(addrId, newLoc, forceAlias) => {

      DeferredAddressDAO.findOneById(new ObjectId(addrId)).map {entry =>
        val relatedClasses = entry.relatedClasses

        DeferredAddressDAO.remove(entry)
        //context.actorOf(Props[AddressDAO]) ! ClassListLocation(newLoc, relatedClasses, forceAlias)

        actorOf(Props[AddressDAO]) ! LocationClassEntry(newLoc, relatedClasses, forceAlias, entry.lastUpdated)
      }
    }

  }
}

class CompetitorClassDAO extends Actor {

  def receive = {
    case CompetitorEntry(address, classList: List[CompetitorClass]) => {
      val sampleClass = classList.head

      DeferredAddressDAO.findOne(MongoDBObject("originalAddress" -> address)) match {
        case Some(entry) =>  {
          DeferredAddressDAO.update(MongoDBObject("_id" -> entry.id), entry.copy(lastUpdated = DateTime.now, relatedClasses = classList), false, false, new WriteConcern)
        }
        case None => DeferredAddressDAO.insert(WebQlEntry(competitorName = sampleClass.competitor,
          programName = sampleClass.program,
          originalAddress = address,
          relatedClasses = classList))
      }

      /*val dId = DeferredAddressDAO.findOne(MongoDBObject("competitorName" -> sampleClass.competitor)) match{
        case Some(jobDirectory) => {
          jobDirectory.id
        }
        case _ => {
          val newDirectory = WebQLJobDirectory(competitorName = sampleClass.competitor)

          DeferredAddressDAO.insert(newDirectory)
          newDirectory.id
        }
      }

      val entryId = DeferredAddressDAO.entries.insert(WebQLJobEntry(new ObjectId, sampleClass.program, lastUpdated = DateTime.now, directoryId = dId))

      entryId.map{id =>
        DeferredAddressDAO.entries.deferredAddresses.insert(DeferredClassLocation(DateTime.timeBasedUUID.toString, address.toString, classList,id))
      }*/
    }
   /* case mp: ClassDelta => {

    }*/
  }
}

 */