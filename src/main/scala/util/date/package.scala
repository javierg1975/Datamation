package util

import java.util.{TimeZone, Date}
import java.sql.Timestamp

package object date{
  implicit def date2Timestamp(dt: Date): Timestamp = new Timestamp(dt.getTime)
  implicit def dateTime2Timestamp(dt: DateTime): Timestamp = new Timestamp(dt.timeInstant(TimeZoneFormat.defaultTimeZone))
  implicit def timestamp2DateTime(timeStamp: Timestamp):DateTime = DateTime(timeStamp.getTime)
  implicit def dateTime2JavaUtilDate(dt: DateTime): Date = new Date(dt.timeInstant(TimeZoneFormat.defaultTimeZone))
  implicit def int2TimeUnit(i: Int): DateTimeUnit = DateTimeUnit(i)

  object TimeZoneFormat {
    val defaultTimeZone = TimeZone.getDefault
    val defaultDateformatPattern = "yyyy-MM-dd"
  }
}