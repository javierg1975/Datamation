package core

import com.novus.salat.annotations.raw.Key

case class DataItem(@Key("_id") id: (String, String), dataPoints: Vector[(String, Int)])


