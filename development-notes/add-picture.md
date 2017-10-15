--- B --- 
##Preview & Upload 
Preview, Finish Adding, Upload pic
(add-picture component)

* behavior/feature

    app-pic html
1. ui show/preview image (stored in uploader service )

2. text caption feature 
    -  form & input & button
    -  form & input & button

 -->
<!-- 3. upload the new image  -->
    - used the currentfile saved from uploader service 
    - uploadPic method 
        - (Res) 
        - requirements: 
            - generateImages
                - Thumb image specs maxdimension 
                - " quality 
                - 



resources for this work 
1. https://angular.io/api/forms/NgForm
2. https://angular.io/api/forms/NgModel
3. https://app.pluralsight.com/playercourse=angular-fundamentals&author=jim-cooper&name=angular-fundamentals-m6&clip=2&mode=live
4. This is promise deferred work around: http://scotthannen.org/blog/2016/03/03/second-look-at-promises-native-es6.html








---- A --- 
 ##CHOOSE PICTURE STEP
 interface 4 choosing is shell(header)

* USER INTERFACE HTML5 (basic)





 1.  come back to

* ON CHANGE EVENT (CLASS LOGIC)
 * requirements:no particular orderpopen quote
 <!-- TODO: look to do this o   -->
- 1: CLEAR PRIOR STUFF(see more)
x- 2: GET  & DOUBLE STORE FILE: note: this.currentFile = event.target.files[0]
x- #: CLEAR FILE PICKER INPUT(NxxOW STUFF)
x- 3: READ FILE AS A DATA URL
x- 3.1: STORE IMAGE data url locally




x- 3.2: NAVIGATE to add picture
<!-- TODO: look to do this o   -->
- 3.3: ?disable upload ui?






more:

clear prior stuff:
-  1: CLEAR RESET : uploader clear method
 - CLEARS CURRENT FILE local storage value(using in uploading after preview)-  CANCELS all firebase listeners?-  CLEAR previous  pic and preview
- IMAGE SOURCE in this case empties the source attribute(this may be good for the add picture view)
- IMAGE FILE stored -
- locallyhttps://github.com/firebase/friendlypix-web/blob/master/public/scripts/uploader.js#L135
