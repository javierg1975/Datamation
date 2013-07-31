package util.config

import util.log._

object TokenHandler extends Loggeable{  
  import org.parboiled.common.Base64
  private lazy val base64 = Base64.custom()
  private lazy val charset = "UTF-8"
  private lazy val merger = ":"


  /**
   * Encode the provided token using a custom Base64 alphabet with a UTF-8 CharSet
   * @param token the string to encode
   * @return the encoded string
   */
  def encodeToken(token: String): String = {
    debug(s"Encoding: $token")
    base64.encodeToString(token.getBytes(charset), false)
  } //def

  /**
   * Decode the provided token using a custom Base64 alphabet with a UTF-8 CharSet
   * @param token the string to decode
   * @return the decoded string
   */
  def decodeToken(token: String): String = {
    debug(s"Going to decode $token")
    new String( base64.decode(token), charset)
  } //def

  /**
   * Tokenizes the user credentials into a string format.
   * @param credentials The user credentials to tokenize
   * @return The tokenized credentials
   */
  def tokenize(credentials: UserCredentialsToken): String = encodeToken(s"${credentials.login}:${credentials.passwd}")

  /**
   *  Tokenizes the user credentials into a string format.
   * @param login the user login
   * @param passwd the user passwd
   * @return The tokenized credentials
   */
  def tokenize(login: String, passwd: String): String = tokenize(UserCredentialsToken(login, passwd))

  /**
   * Untokenizes a tokenized token.
   * This means that this method takes a string parameter, decodes it, and finally decomposes it
   * to get the original user credentials. If the string was not tokenized before, an IlligalArgumentException
   * is thrown.
   * @param token the tokenized String
   * @return UerCredentialsToken
   */
  def untokenize(token: String): UserCredentialsToken = {
    val decoded = decodeToken(token)
    require(decoded.contains(merger))
    val temp = decoded.split(merger)
    UserCredentialsToken(temp.head, temp.last)
  } //def

} //object

case class UserCredentialsToken(login:String, passwd: String)