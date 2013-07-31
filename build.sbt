import com.typesafe.sbt.SbtStartScript

name := "Datamation"

seq(SbtStartScript.startScriptForClassesSettings: _*)

version := "0.1"

libraryDependencies ++= Seq(	
    "com.typesafe.akka" %% "akka-actor" % "2.2.0",
    "com.typesafe.akka" %% "akka-camel" % "2.2.0",
    "com.typesafe.akka" %% "akka-slf4j" % "2.2.0",
    "ch.qos.logback" % "logback-classic" % "1.0.0",
    "net.sf.opencsv" % "opencsv" % "2.1",
    "org.scalaj" %% "scalaj-collection" % "1.5",
    "hirondelle.date4j" % "date4j" % "1.0" from "http://www.date4j.net/date4j.jar",
    "commons-io" % "commons-io" % "2.0.1",
    "com.fasterxml.uuid" % "java-uuid-generator" % "3.1.1",
    "io.spray" % "spray-routing" % "[1.2-20130712,)",
    "io.spray" % "spray-client" % "[1.2-20130712,)",
    "io.spray" % "spray-can" % "[1.2-20130712,)",
    "io.spray" %% "spray-json" % "1.2.3",
    "net.virtual-void" %%  "json-lenses" % "0.5.2",
    "org.mongodb" %% "casbah" % "2.5.0",
    "com.novus" %% "salat" % "1.9.2-SNAPSHOT"
)

resolvers ++= Seq("Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
                "Typesafe Snapshot Repository" at "http://repo.typesafe.com/typesafe/snapshots/",
                "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots",
                "Twitter Maven Repo" at "http://maven.twttr.com/",
				"Maven Central" at "http://repo1.maven.org/maven2",
				"Apache Repo" at "http://maven.apache.org",
                "Spray Repo" at "http://repo.spray.cc/",
                "Spray Nightlies" at "http://nightlies.spray.io")

atmosSettings

traceAkka("2.2.0")

retrieveManaged := true

// reduce the maximum number of errors shown by the Scala compiler
maxErrors := 20

// increase the time between polling for file changes when using continuous execution
pollInterval := 1000

javacOptions ++= Seq("-source", "1.6", "-target", "1.6")

scalacOptions += "-deprecation"

scalaVersion := "2.10.1"

// set the prompt (for this build) to include the project id.
shellPrompt in ThisBuild := { state => Project.extract(state).currentRef.project + "> " }

// set the prompt (for the current project) to include the username
shellPrompt := { state => System.getProperty("user.name") + "> " }

// only show 20 lines of stack traces
traceLevel := 20

logLevel := Level.Info

mainClass in Compile := Some("util.Boot")

artifactName := { (sv: ScalaVersion, module: ModuleID, artifact: Artifact) =>
  artifact.name + "-" + module.revision + "." + artifact.extension
}

