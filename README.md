# [Color-Extractor](https://jihunkimcode.github.io/Color-Extractor/)
## How to Use
![image](https://github.com/user-attachments/assets/405692dd-02eb-4783-9ea6-38ecfc7b41e9)

**Click** the dotted area to upload an image. **Drag and drop** an image is also allowed.

To change the uploaded image, click the uploaded image or drag and drop over the uploaded image.

It supports almost all image formats including **jpg, jpeg, png, gif, webp, and svg**.

## Features
![color-50](https://github.com/user-attachments/assets/822c48ff-9801-4acd-8615-68558d8e7e0c)
* Upload image to **extract dominant colors**.
* **Color picker tool** to directly get a color from the image.
  * Users can change the color of the last color box by clicking the color picker icon.
* Click color boxes to **copy the hex code** of the color.
* Users can **change the colors** of the image as they wish. They can revert it as well.
* Users can choose **color distance threshold value**.
  * Color Distance controls color matching: Smaller values require closer similarity, ideal for detailed work.

## Color Distance Value and Color Changing
### Color Distance = 10
![color-10-green](https://github.com/user-attachments/assets/97d5a2b1-594c-4ea5-8b63-29eaaa825a89)

### Color Distance = 50
![color-50-green](https://github.com/user-attachments/assets/b8a3cae3-5ddc-4bf7-8d3e-6b446db816dc)

### Color Distance = 100
![color-100-green](https://github.com/user-attachments/assets/90d4867d-0624-44e0-814c-8bfdfb2273ac)

To cluster similar colors, it uses color differences equation specifically, [**Euclidean distance**](https://en.wikipedia.org/wiki/Color_difference):
![image](https://github.com/user-attachments/assets/83104bcf-4b05-4ccb-b974-facfb7bbb359)

When the calculated difference value is less than Color Distance value that user chose, those colors are considered as similar colors.
