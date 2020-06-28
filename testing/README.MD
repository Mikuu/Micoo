Image Processing
--

> below tests require ImageMagic be installed

- check image info
```commandline
identify baseline/reactjs.png
```

- paint characters on image
```commandline
convert baseline/bing.png -gravity Center  -pointsize 120 -annotate 0 "diff" latest/bing.png
```

- convert png to webp
```commandline
convert baseline/reactjs.png -resize 348x225 latest/reactjs.webp
convert baseline/reactjs.png -resize 40% latest/reactjs.webp
```
