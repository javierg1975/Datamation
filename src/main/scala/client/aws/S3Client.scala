package client.aws


import java.io.BufferedReader
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.io.Writer
import java.util.UUID

import com.amazonaws.AmazonClientException
import com.amazonaws.AmazonServiceException
import com.amazonaws.auth.ClasspathPropertiesFileCredentialsProvider
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.model.Bucket
import com.amazonaws.services.s3.model.GetObjectRequest
import com.amazonaws.services.s3.model.ListObjectsRequest
import com.amazonaws.services.s3.model.ObjectListing
import com.amazonaws.services.s3.model.PutObjectRequest
import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.model.S3ObjectSummary
import org.apache.commons.io.FileUtils


case class S3Client(data: Array[Byte]){

    /*
     * This credentials provider implementation loads your AWS credentials
     * from a properties file at the root of your classpath.
     *
     * Important: Be sure to fill in your AWS access credentials in the
     *            AwsCredentials.properties file before you try to run this
     *            sample.
     * http://aws.amazon.com/security-credentials
     */
    val s3: AmazonS3 = new AmazonS3Client(new ClasspathPropertiesFileCredentialsProvider())
    val usEast1: Region = Region.getRegion(Regions.US_EAST_1)
    s3.setRegion(usEast1)

    val bucketName = "Datalize"
    val key = "MyObjectKey"     //not sure what this is

    /*
     * Upload an object to your bucket - You can easily upload a file to
     * S3, or upload directly an InputStream if you know the length of
     * the data in the stream. You can also specify your own metadata
     * when uploading to S3, which allows you set a variety of options
     * like content-type and content-encoding, plus additional metadata
     * specific to your applications.
     */


    def save() = {
      val tempFile = new File(UUID.randomUUID().toString)
      FileUtils.writeByteArrayToFile(tempFile, data)

      s3.putObject(new PutObjectRequest(bucketName, key, tempFile ))
    }

}

