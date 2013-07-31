package core

case class Component(self: String, id: String, name: String)

case class Project(self: String, id: String, key: String, name: String)

case class FieldDescriptor(summary: String, components: List[Component], project: Project)

case class Issue(id: String, self: String, key: String, fields: FieldDescriptor)

case class JiraResponse(issues: List[Issue])


