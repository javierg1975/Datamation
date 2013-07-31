package util.csv

import java.io.StringReader
import au.com.bytecode.opencsv.CSVReader
import scalaj.collection.Imports._

case class CsvReader(data: String, separator: Char = '\t') {
  private val reader = new CSVReader(new StringReader(data), separator)

  val entries = reader.readAll().asScala.toVector map{array =>
    array(0).split(",").toList
  }
}
