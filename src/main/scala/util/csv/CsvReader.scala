package util.csv

import java.io.StringReader
import au.com.bytecode.opencsv.CSVReader
import scalaj.collection.Imports._

case class CsvReader(data: String) {
  private val reader = new CSVReader(new StringReader(data))

  val entries = reader.readAll().asScala.toVector map(_.toVector)
}
