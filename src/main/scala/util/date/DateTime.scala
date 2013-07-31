package util.date

import hirondelle.date4j.{DateTime => HDT}
import java.text.SimpleDateFormat
import TimeZoneFormat._
import java.util.{UUID, Date, Locale, TimeZone}
import java.util
import com.fasterxml.uuid.{EthernetAddress, Generators}

// this idea could use some more refining... right now the default state of an object is an illegal one (see method `+` in DateTime)
case class DateTimeUnit(unit: Int, index: Option[Int] = None){
  def years = DateTimeUnit(unit, Some(0))
  def months = DateTimeUnit(unit,Some(1))
  def days = DateTimeUnit(unit, Some(2))
  def hours = DateTimeUnit(unit, Some(3))
  def minutes = DateTimeUnit(unit, Some(4))
  def seconds = DateTimeUnit(unit, Some(5))
  def milliseconds = DateTimeUnit(unit, Some(6))
}

case class DateTime(ti: Long) extends Ordered[DateTime] {
  private def asList = List(year, month, day)

  val dateTimeSeed = HDT.forInstant(ti, defaultTimeZone)  // FIX: sometimes I end up converting from `Long` to `HTD` just to reverse the conversion here again


  //def this() = this(HDT.now(defaultTimeZone).getMilliseconds(defaultTimeZone))

  // kinda overlaps with `fromString`
  //def this(dateStr: String, dateStrFormat: String = defaultDateformatPattern) = this((new SimpleDateFormat(dateStrFormat).parse(dateStr)).getTime)


  def compare(other: DateTime): Int = {
    dateTimeSeed.compareTo(other.dateTimeSeed)
  }

  def toTimezone(timezone: TimeZone): DateTime = DateTime(this.timeInstant(timezone))

  // TODO: better than the original version, can still be improved (perhaps it should belong to DateTimeUnit instead?)
  def +(du: DateTimeUnit): DateTime = {
    val idx = du.index.getOrElse(throw new IllegalArgumentException("A valid time unit needs to be specified"))
    val newDateElements = asList.updated(idx, du.unit)

    DateTime((new HDT(newDateElements(0), newDateElements(1), newDateElements(2), 0, 0, 0, 0)).getMilliseconds(defaultTimeZone))
  }

  def timeInstant(tmz: TimeZone): Long = dateTimeSeed.getMilliseconds(tmz)

  def formatAs(formatStr: String, loc:Locale, tmz: TimeZone): String = new SimpleDateFormat(formatStr, loc).format(new Date(timeInstant(tmz)))
  def formatAs(formatStr: String): String = formatAs(formatStr, Locale.US, defaultTimeZone)
  def format: String = formatAs(defaultDateformatPattern, Locale.US, defaultTimeZone)

  override def toString = format

  def year: Int = dateTimeSeed.getYear
  def month: Int = dateTimeSeed.getMonth
  def day: Int = dateTimeSeed.getDay
}

object DateTime {
  val defaultSeparator = "-"

  def now: DateTime = new DateTime(HDT.now(defaultTimeZone).getMilliseconds(defaultTimeZone))

  def timeBasedUUID: UUID = Generators.timeBasedGenerator(EthernetAddress.fromInterface).generate()

  def apply(dateStr: String) = fromString(dateStr)

  def fromList(dateElements: List[Int]):Option[DateTime] = {
    val de = dateElements.take(7) //ignore any element in the list past the 7th

    try{
      Some(DateTime((new HDT(de(0), de(1), de(2), de(3), de(4), de(5), de(6))).getMilliseconds(defaultTimeZone)))
    }
    catch {
      case e: Exception => None
    }
  }

  def fromString(str: String, guessPartial: Boolean = false): Option[DateTime] = try {
    def isPartial(str: String): Boolean = {
      !((str.split(defaultSeparator).lift)(2) isDefined)
    }

    if (isPartial(str) && guessPartial)
      fromPartialString(str)
    else
      Some(new DateTime((new HDT(str)).getMilliseconds(defaultTimeZone)))   // see comment at dateTimeSeed
  }
  catch {
    case rte: RuntimeException => None
  }

  def fromString(str: String, separator: String, guessPartial: Boolean): Option[DateTime] = {
    fromString(str.replaceAll(separator, "-"), guessPartial)
  }

  def fromPartialString(str: String): Option[DateTime] = {
    // date elements in reverse order, day first (this assumes the date was originally formatted in  EN-US format)
    val elementSelector = str.split("-").toList.take(3).map(_.toInt).lift

    val default = now
    val defaultElementSelector = List(default.day, default.month, default.year).lift

    val dateElements = (0 to 2).map(de => elementSelector(de).orElse(defaultElementSelector(de))).flatten.toList

    try {
      Some(new DateTime(HDT.forDateOnly(dateElements(2), dateElements(1), dateElements(0)).getMilliseconds(defaultTimeZone))) // see comment at dateTimeSeed
    }
    catch {
      case rte: RuntimeException => None
    }
  }

  import HDT.DayOverflow._

  def NoOverflow: HDT.DayOverflow = Abort

  def FirstDayOverflow: HDT.DayOverflow = FirstDay

  def LastDayOverflow: HDT.DayOverflow = LastDay

  def SpilloverOverflow: HDT.DayOverflow = Spillover

  def fromUUID(uuid: UUID): DateTime = DateTime((uuid.timestamp - 122192928000000000L) / 10000)

  def dateRange(start : String, end: String, guessPartial: Boolean = false): (DateTime, DateTime) = {
    var startDate = fromString(start, guessPartial).getOrElse(throw new IllegalArgumentException("Invalid date string provided: " + start))
    var endDate = fromString(end, guessPartial).getOrElse(throw new IllegalArgumentException("Invalid date string provided: " + end))

    if (startDate > endDate)
      endDate = endDate + 1.years  // push the end date to next year
    else if (startDate + 10.days < now){
      startDate = startDate + 1.years
      endDate = endDate + 1.years
    }

    (startDate, endDate)
  }
}





