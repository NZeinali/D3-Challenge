# Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Task

![4-scatter](Images/4-scatter.jpg)

Data visualisation is provided between the data variables of `Healthcare vs. Poverty` to run a series of feature stories about the health risks facing particular demographics. The data is obtained from the U.S. Census Bureau and the Behavioural Risk Factor Surveillance System and it includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error".

Using the D3 techniques, a scatter plot is created to represent each state with circle elements that is coded in the `app.js` file. 

* State abbreviations is included in the circles.

- - -

### Additional task

An interactive graphic is created using D3 library.

![7-animated-scatter](Images/7-animated-scatter.gif)

The dynamic graph is created from more demographics and more risk factors. Additional labels in the scatter plot is given so that the users can decide which data to display. 

Tooltips are added to the circles that display the information related to the data that the user has selected. The `d3-tip.js` plugin is used for this purpose which is developed by [Justin Palmer](https://github.com/Caged).

![8-tooltip](Images/8-tooltip.gif)