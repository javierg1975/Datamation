#setwd("/Users/paulbuffa/ChartGifs")

#dir.create("working_examples")
#setwd("working_examples")

#install.packages("animation")
#install.packages("ggplot")

library(animation)
library(ggplot2)

#data.csv <- read.csv("/Users/paulbuffa/Desktop/data.csv", header = T)
data.csv <- read.csv("data.csv", header = T)

x <- data.csv[,1] 
y <- data.csv[,2]  
z <- length(x)
time <- 4
window <- z/time
chart_type <- "bar"  #"smooth", "boxplot", "line", "histogram", "density", "bar", "point", and "jitter".
xlabel <- colnames(data.csv)[1]
ylabel <- colnames(data.csv)[2]
main_var <- paste(ylabel,"by",xlabel)
main_var2 <- paste(xlabel,"by",ylabel)

#doing the stats
mean_val <- mean(as.numeric(y))
med_val <- median(as.numeric(y))
min_val <- min(as.numeric(y))
max_val <- max(as.numeric(y))
row_num <- z
stdev_val <- sd(as.numeric(y), na.rm = FALSE)
variance_val <- var(as.numeric(y))
num_col_val <- ncol(data.csv)
for (i in 1:(z)){  
  if(as.numeric(y[i]) > (mean_val + stdev_val))
  {
    outlier_set <- x[i]
  }  
}


png(file="file_one.jpg", width=400, height=400)
print(
  qplot(x,y,
        group=x,
        geom="point",
        main=main_var,
        color=y,
        size=y,
        xlab=xlabel,
        xaxt="n",
        fill=y,
        ylab=ylabel) 
      + theme(legend.position = "none", 
              axis.text.x = element_blank())
)
dev.off()

png(file="file_two.jpg", width=400, height=600)
print(
  qplot(y,x,
        group=y,
        geom="point",
        main=main_var2,
        color=x,
        size=x,
        xlab=ylabel,
        xaxt="n",
        yaxt="n",
        fill=x,
        ylab=xlabel)
      + theme(legend.position = "none", 
              axis.text.y = element_blank())
)
dev.off()

png(file="%d.png", width=400, height=600)
for (i in 1:(z-window)){  
  print(
    qplot(y,x,
          group=y,
          geom="point",
          main=main_var2,
          color=x,
          size=x,
          xlab=ylabel,
          xaxt="n",
          fill=x,
          ylab=xlabel) 
    + coord_cartesian(ylim = c(i,i+window))
    + theme(legend.position = "none")
    
  )
}
dev.off()

text <- paste("convert -delay 15  $(for i in $(seq 1 1 ",(z-window),"); do echo ${i}.png; done) -loop 0 gifone.gif")

system(text)

file.remove(list.files(pattern=".png"))

png(file="%d.png", width=600, height=400)
for (i in 1:(z-window)){  
  print(
    qplot(x,y,
          group=x,
          geom="bar",
          main=main_var,
          color=y,
          #size=y,
          xlab=xlabel,
          xaxt="n",
          fill=y,
          ylab=ylabel) 
          #axis.Date(1, at=seq(as.Date("2001/1/1"), i+6, "weeks"))
          #axis.Date(1, at=seq(as.Date("2001/1/1"), i+6, "days"),
          #         labels = FALSE, tcl = -0.2)
    + coord_cartesian(xlim = c(i,i+window))
    + theme(axis.text.x = element_text(angle = 90, hjust = 1))
    
  )
}
dev.off()

text <- paste("convert -delay 15  $(for i in $(seq 1 1 ",(z-window),"); do echo ${i}.png; done) -loop 0 giftwo.gif")

system(text)

file.remove(list.files(pattern=".png"))
