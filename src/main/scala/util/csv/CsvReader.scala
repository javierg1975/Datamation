package util.csv

import java.io.StringReader
import au.com.bytecode.opencsv.CSVReader
import scalaj.collection.Imports._

case class CsvReader(data: String, separator: Char = '\t') {
  private val reader = new CSVReader(new StringReader(data), separator)

  private val headers::items = reader.readAll().asScala.toList

  private def itemize(a: Array[String]) = {
    a(0).split(",").toList
  }

  val entries = items.toList map{array =>
    itemize(headers) zip itemize(array)
  }

}
