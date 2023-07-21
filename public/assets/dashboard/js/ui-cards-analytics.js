/**
 * Card Analytics
 */

'use strict';

(function () {
  let cardColor, headingColor, labelColor, shadeColor, borderColor, legendColor, heatMap1, heatMap2, heatMap3, heatMap4;

  if (isDarkStyle) {
    cardColor = config.colors_dark.cardColor;
    headingColor = config.colors_dark.headingColor;
    labelColor = config.colors_dark.textMuted;
    borderColor = config.colors_dark.borderColor;
    legendColor = config.colors_dark.bodyColor;
    shadeColor = 'dark';
    heatMap1 = '#4f51c0';
    heatMap2 = '#595cd9';
    heatMap3 = '#8789ff';
    heatMap4 = '#c3c4ff';
  } else {
    cardColor = config.colors.cardColor;
    headingColor = config.colors.headingColor;
    labelColor = config.colors.textMuted;
    borderColor = config.colors.borderColor;
    legendColor = config.colors.bodyColor;
    shadeColor = '';
    heatMap1 = '#e1e2ff';
    heatMap2 = '#c3c4ff';
    heatMap3 = '#a5a7ff';
    heatMap4 = '#696cff';
  }

  // Customer Ratings - Line Charts
  // --------------------------------------------------------------------
  const customerRatingsChartEl = document.querySelector('#customerRatingsChart'),
    customerRatingsChartOptions = {
      chart: {
        height: 200,
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        dropShadow: {
          enabled: true,
          enabledOnSeries: [1],
          top: 13,
          left: 4,
          blur: 3,
          color: config.colors.primary,
          opacity: 0.09
        }
      },
      series: [
        {
          name: 'Last Month',
          data: [20, 54, 20, 38, 22, 28, 16, 19]
        },
        {
          name: 'This Month',
          data: [20, 32, 22, 65, 40, 46, 34, 70]
        }
      ],
      stroke: {
        curve: 'smooth',
        dashArray: [8, 0],
        width: [3, 4]
      },
      legend: {
        show: false
      },
      colors: [borderColor, config.colors.primary],
      grid: {
        show: false,
        borderColor: borderColor,
        padding: {
          top: -20,
          bottom: -10,
          left: 0
        }
      },
      markers: {
        size: 6,
        colors: 'transparent',
        strokeColors: 'transparent',
        strokeWidth: 5,
        hover: {
          size: 6
        },
        discrete: [
          {
            fillColor: config.colors.white,
            seriesIndex: 1,
            dataPointIndex: 7,
            strokeColor: config.colors.primary,
            size: 6
          },
          {
            fillColor: config.colors.white,
            seriesIndex: 1,
            dataPointIndex: 3,
            strokeColor: config.colors.black,
            size: 6
          }
        ]
      },
      xaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        },
        axisTicks: {
          show: false
        },
        categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false
      }
    };
  if (typeof customerRatingsChartEl !== undefined && customerRatingsChartEl !== null) {
    const customerRatingsChart = new ApexCharts(customerRatingsChartEl, customerRatingsChartOptions);
    customerRatingsChart.render();
  }

  // Sale Stats - Radial Bar Chart
  // --------------------------------------------------------------------
  const salesStatsEl = document.querySelector('#salesStats'),
    salesStatsOptions = {
      chart: {
        height: 300,
        type: 'radialBar'
      },
      series: [75],
      labels: ['Sales'],
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          strokeWidth: '70',
          hollow: {
            margin: 50,
            size: '75%',
            image: assetsPath + 'img/icons/misc/arrow-star.png',
            imageWidth: 65,
            imageHeight: 55,
            imageOffsetY: -35,
            imageClipped: false
          },
          track: {
            strokeWidth: '50%',
            background: borderColor
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: 60,
              show: true,
              color: legendColor,
              fontSize: '15px'
            },
            value: {
              formatter: function (val) {
                return parseInt(val) + '%';
              },
              offsetY: 20,
              color: headingColor,
              fontSize: '32px',
              show: true
            }
          }
        }
      },
      fill: {
        type: 'solid',
        colors: config.colors.success
      },
      stroke: {
        lineCap: 'round'
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof salesStatsEl !== undefined && salesStatsEl !== null) {
    const salesStats = new ApexCharts(salesStatsEl, salesStatsOptions);
    salesStats.render();
  }

  // Sales Analytics - Heat map chart
  // --------------------------------------------------------------------
  const salesAnalyticsChartEl = document.querySelector('#salesAnalyticsChart'),
    salesAnalyticsChartConfig = {
      chart: {
        height: 350,
        type: 'heatmap',
        parentHeightOffset: 0,
        offsetX: -10,
        offsetY: -15,
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: '1k',
          data: [
            { x: 'Jan', y: '250' },
            { x: 'Feb', y: '350' },
            { x: 'Mar', y: '220' },
            { x: 'Apr', y: '290' },
            { x: 'May', y: '650' },
            { x: 'Jun', y: '260' },
            { x: 'Jul', y: '274' },
            { x: 'Aug', y: '850' }
          ]
        },
        {
          name: '2k',
          data: [
            { x: 'Jan', y: '750' },
            { x: 'Feb', y: '3350' },
            { x: 'Mar', y: '1220' },
            { x: 'Apr', y: '1290' },
            { x: 'May', y: '1650' },
            { x: 'Jun', y: '1260' },
            { x: 'Jul', y: '1274' },
            { x: 'Aug', y: '850' }
          ]
        },
        {
          name: '3k',
          data: [
            { x: 'Jan', y: '375' },
            { x: 'Feb', y: '1350' },
            { x: 'Mar', y: '3220' },
            { x: 'Apr', y: '2290' },
            { x: 'May', y: '2650' },
            { x: 'Jun', y: '2260' },
            { x: 'Jul', y: '1274' },
            { x: 'Aug', y: '815' }
          ]
        },
        {
          name: '4k',
          data: [
            { x: 'Jan', y: '575' },
            { x: 'Feb', y: '1350' },
            { x: 'Mar', y: '2220' },
            { x: 'Apr', y: '3290' },
            { x: 'May', y: '3650' },
            { x: 'Jun', y: '2260' },
            { x: 'Jul', y: '1274' },
            { x: 'Aug', y: '315' }
          ]
        },
        {
          name: '5k',
          data: [
            { x: 'Jan', y: '875' },
            { x: 'Feb', y: '1350' },
            { x: 'Mar', y: '2220' },
            { x: 'Apr', y: '3290' },
            { x: 'May', y: '3650' },
            { x: 'Jun', y: '2260' },
            { x: 'Jul', y: '1274' },
            { x: 'Aug', y: '965' }
          ]
        },
        {
          name: '6k',
          data: [
            { x: 'Jan', y: '575' },
            { x: 'Feb', y: '1350' },
            { x: 'Mar', y: '2220' },
            { x: 'Apr', y: '2290' },
            { x: 'May', y: '2650' },
            { x: 'Jun', y: '3260' },
            { x: 'Jul', y: '1274' },
            { x: 'Aug', y: '815' }
          ]
        },
        {
          name: '7k',
          data: [
            { x: 'Jan', y: '575' },
            { x: 'Feb', y: '1350' },
            { x: 'Mar', y: '1220' },
            { x: 'Apr', y: '1290' },
            { x: 'May', y: '1650' },
            { x: 'Jun', y: '1260' },
            { x: 'Jul', y: '3274' },
            { x: 'Aug', y: '815' }
          ]
        },
        {
          name: '8k',
          data: [
            { x: 'Jan', y: '575' },
            { x: 'Feb', y: '350' },
            { x: 'Mar', y: '220' },
            { x: 'Apr', y: '290' },
            { x: 'May', y: '650' },
            { x: 'Jun', y: '260' },
            { x: 'Jul', y: '274' },
            { x: 'Aug', y: '815' }
          ]
        }
      ],
      plotOptions: {
        heatmap: {
          enableShades: false,
          radius: '6px',
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 1000,
                name: '1k',
                color: heatMap1
              },
              {
                from: 1001,
                to: 2000,
                name: '2k',
                color: heatMap2
              },
              {
                from: 2001,
                to: 3000,
                name: '3k',
                color: heatMap3
              },
              {
                from: 3001,
                to: 4000,
                name: '4k',
                color: heatMap4
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 4,
        colors: [cardColor]
      },
      legend: {
        show: false
      },
      grid: {
        show: false,
        padding: {
          top: -15,
          left: 10,
          bottom: -7
        }
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        }
      },
      responsive: [
        {
          breakpoint: 1441,
          options: {
            chart: {
              height: '325px'
            },
            grid: {
              padding: {
                right: -15
              }
            }
          }
        },
        {
          breakpoint: 1045,
          options: {
            chart: {
              height: '300px'
            },
            grid: {
              padding: {
                right: -50
              }
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              height: '320px'
            },
            grid: {
              padding: {
                right: -50
              }
            }
          }
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              height: '400px'
            },
            grid: {
              padding: {
                right: 0
              }
            }
          }
        },
        {
          breakpoint: 568,
          options: {
            chart: {
              height: '330px'
            },
            grid: {
              padding: {
                right: -20
              }
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof salesAnalyticsChartEl !== undefined && salesAnalyticsChartEl !== null) {
    const salesAnalyticsChart = new ApexCharts(salesAnalyticsChartEl, salesAnalyticsChartConfig);
    salesAnalyticsChart.render();
  }

  // Overview & Sales Activity - Staked Bar Chart
  // --------------------------------------------------------------------
  const salesActivityChartEl = document.querySelector('#salesActivityChart'),
    salesActivityChartConfig = {
      chart: {
        type: 'bar',
        height: 235,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: 'PRODUCT A',
          data: [75, 50, 55, 60, 48, 82, 59]
        },
        {
          name: 'PRODUCT B',
          data: [25, 29, 32, 35, 34, 18, 30]
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          borderRadius: 10,
          startingShape: 'rounded',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 6,
        lineCap: 'round',
        colors: [cardColor]
      },
      legend: {
        show: false
      },
      colors: [config.colors.danger, '#435971'],
      fill: {
        opacity: 1
      },
      grid: {
        show: false,
        strokeDashArray: 7,
        padding: {
          top: -40,
          left: 0,
          right: 0
        }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          show: true,
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      responsive: [
        {
          breakpoint: 1440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 1300,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '55%'
              }
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '45%'
              }
            }
          }
        },
        {
          breakpoint: 1040,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 12,
                columnWidth: '40%'
              }
            },
            chart: {
              type: 'bar',
              height: 320
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '25%'
              }
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '35%'
              }
            }
          }
        },
        {
          breakpoint: 440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '45%'
              }
            }
          }
        },
        {
          breakpoint: 360,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 8,
                columnWidth: '50%'
              }
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof salesActivityChartEl !== undefined && salesActivityChartEl !== null) {
    const salesActivityChart = new ApexCharts(salesActivityChartEl, salesActivityChartConfig);
    salesActivityChart.render();
  }

  // Total Income - Area Chart
  // --------------------------------------------------------------------
  const totalIncomeEl = document.querySelector('#totalIncomeChart'),
    totalIncomeConfig = {
      chart: {
        height: 220,
        type: 'area',
        toolbar: false,
        dropShadow: {
          enabled: true,
          top: 14,
          left: 2,
          blur: 3,
          color: config.colors.primary,
          opacity: 0.15
        }
      },
      series: [
        {
          data: [3350, 3350, 4800, 4800, 2950, 2950, 1800, 1800, 3750, 3750, 5700, 5700]
        }
      ],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'straight'
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.8,
          opacityFrom: 0.7,
          opacityTo: 0.25,
          stops: [0, 95, 100]
        }
      },
      grid: {
        show: true,
        borderColor: borderColor,
        padding: {
          top: -15,
          bottom: -10,
          left: 0,
          right: 0
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          offsetX: 0,
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        lines: {
          show: false
        }
      },
      yaxis: {
        labels: {
          offsetX: -15,
          formatter: function (val) {
            return '$' + parseInt(val / 1000) + 'k';
          },
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        },
        min: 1000,
        max: 6000,
        tickAmount: 5
      }
    };
  if (typeof totalIncomeEl !== undefined && totalIncomeEl !== null) {
    const totalIncome = new ApexCharts(totalIncomeEl, totalIncomeConfig);
    totalIncome.render();
  }

  // Income Chart - Area chart
  // --------------------------------------------------------------------
  const incomeChartEl = document.querySelector('#incomeChart'),
    incomeChartConfig = {
      series: [
        {
          data: [24, 21, 30, 22, 42, 26, 35, 29]
        }
      ],
      chart: {
        height: 200,
        parentHeightOffset: 0,
        parentWidthOffset: 0,
        toolbar: {
          show: false
        },
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      legend: {
        show: false
      },
      markers: {
        size: 6,
        colors: 'transparent',
        strokeColors: 'transparent',
        strokeWidth: 4,
        discrete: [
          {
            fillColor: config.colors.white,
            seriesIndex: 0,
            dataPointIndex: 7,
            strokeColor: config.colors.primary,
            strokeWidth: 2,
            size: 6,
            radius: 8
          }
        ],
        hover: {
          size: 7
        }
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.6,
          opacityFrom: 0.5,
          opacityTo: 0.25,
          stops: [0, 95, 100]
        }
      },
      grid: {
        borderColor: borderColor,
        strokeDashArray: 3,
        padding: {
          top: -20,
          bottom: -8,
          left: -10,
          right: 8
        }
      },
      xaxis: {
        categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true,
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        },
        min: 10,
        max: 50,
        tickAmount: 4
      }
    };
  if (typeof incomeChartEl !== undefined && incomeChartEl !== null) {
    const incomeChart = new ApexCharts(incomeChartEl, incomeChartConfig);
    incomeChart.render();
  }

  // Expenses Mini Chart - Radial Chart
  // --------------------------------------------------------------------
  const weeklyExpensesEl = document.querySelector('#expensesOfWeek'),
    weeklyExpensesConfig = {
      series: [65],
      chart: {
        width: 50,
        height: 50,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          strokeWidth: '8',
          hollow: {
            margin: 2,
            size: '40%'
          },
          track: {
            strokeWidth: '50%',
            background: borderColor
          },
          dataLabels: {
            show: true,
            name: {
              show: false
            },
            value: {
              formatter: function (val) {
                return '$' + parseInt(val);
              },
              offsetY: 5,
              color: '#697a8d',
              fontSize: '13px',
              show: true
            }
          }
        }
      },
      fill: {
        type: 'solid',
        colors: config.colors.primary
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          top: -10,
          bottom: -15,
          left: -10,
          right: -10
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof weeklyExpensesEl !== undefined && weeklyExpensesEl !== null) {
    const weeklyExpenses = new ApexCharts(weeklyExpensesEl, weeklyExpensesConfig);
    weeklyExpenses.render();
  }

  // Performance - Radar Chart
  // --------------------------------------------------------------------
  const performanceChartEl = document.querySelector('#performanceChart'),
    performanceChartConfig = {
      series: [
        {
          name: 'Income',
          data: [26, 29, 31, 40, 29, 24]
        },
        {
          name: 'Earning',
          data: [30, 26, 24, 26, 24, 40]
        }
      ],
      chart: {
        height: 270,
        type: 'radar',
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 6,
          left: 0,
          blur: 6,
          color: '#000',
          opacity: 0.14
        }
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: borderColor,
            connectorColors: borderColor
          }
        }
      },
      stroke: {
        show: false,
        width: 0
      },
      legend: {
        show: true,
        fontSize: '13px',
        position: 'bottom',
        labels: {
          colors: legendColor,
          useSeriesColors: false
        },
        markers: {
          height: 10,
          width: 10,
          offsetX: -3
        },
        itemMargin: {
          horizontal: 10
        },
        onItemHover: {
          highlightDataSeries: false
        }
      },
      colors: [config.colors.primary, config.colors.info],
      fill: {
        opacity: [1, 0.85]
      },
      markers: {
        size: 0
      },
      grid: {
        show: false,
        padding: {
          top: -8,
          bottom: -5
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: {
          show: true,
          style: {
            colors: [labelColor, labelColor, labelColor, labelColor, labelColor, labelColor],
            fontSize: '13px',
            fontFamily: 'Public Sans'
          }
        }
      },
      yaxis: {
        show: false,
        min: 0,
        max: 40,
        tickAmount: 4
      }
    };
  if (typeof performanceChartEl !== undefined && performanceChartEl !== null) {
    const performanceChart = new ApexCharts(performanceChartEl, performanceChartConfig);
    performanceChart.render();
  }

  // Total Balance - Line Chart
  // --------------------------------------------------------------------
  const totalBalanceChartEl = document.querySelector('#totalBalanceChart'),
    totalBalanceChartConfig = {
      series: [
        {
          data: [137, 210, 160, 275, 205, 315]
        }
      ],
      chart: {
        height: 225,
        parentHeightOffset: 0,
        parentWidthOffset: 0,
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 10,
          left: 5,
          blur: 3,
          color: config.colors.warning,
          opacity: 0.15
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      legend: {
        show: false
      },
      colors: [config.colors.warning],
      markers: {
        size: 6,
        colors: 'transparent',
        strokeColors: 'transparent',
        strokeWidth: 4,
        discrete: [
          {
            fillColor: config.colors.white,
            seriesIndex: 0,
            dataPointIndex: 5,
            strokeColor: config.colors.warning,
            strokeWidth: 8,
            size: 6,
            radius: 8
          }
        ],
        hover: {
          size: 7
        }
      },
      grid: {
        show: false,
        padding: {
          top: -10,
          left: 0,
          right: 0,
          bottom: 10
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true,
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof totalBalanceChartEl !== undefined && totalBalanceChartEl !== null) {
    const totalBalanceChart = new ApexCharts(totalBalanceChartEl, totalBalanceChartConfig);
    totalBalanceChart.render();
  }

  // Session Overview  Chart - Radial Bar
  // --------------------------------------------------------------------
  const sessionOverviewChartEl = document.querySelector('#sessionOverviewChart'),
    sessionOverviewChartOptions = {
      series: [78],
      labels: ['Loss Rate'],
      chart: {
        height: 200,
        type: 'radialBar'
      },
      colors: [config.colors.warning],
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: -140,
          endAngle: 140,
          hollow: {
            size: '70%'
          },
          track: {
            strokeWidth: '40%',
            background: borderColor
          },

          dataLabels: {
            name: {
              offsetY: 60,
              color: legendColor,
              fontSize: '13px',
              fontFamily: 'Public Sans'
            },
            value: {
              offsetY: -10,
              color: headingColor,
              fontSize: '26px',
              fontWeight: '500',
              fontFamily: 'Public Sans'
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          bottom: -20
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof sessionOverviewChartEl !== undefined && sessionOverviewChartEl !== null) {
    const sessionOverviewChart = new ApexCharts(sessionOverviewChartEl, sessionOverviewChartOptions);
    sessionOverviewChart.render();
  }

  // Score Chart - Radial Bar Chart
  // --------------------------------------------------------------------
  const scoreChartEl = document.querySelector('#scoreChart'),
    scoreChartOptions = {
      series: [78],
      labels: ['Out of 100'],
      chart: {
        height: 195,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '55%'
          },
          track: {
            background: cardColor,
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: 15,
              color: legendColor,
              fontSize: '13px',
              fontFamily: 'Public Sans'
            },
            value: {
              offsetY: -20,
              color: headingColor,
              fontSize: '22px',
              fontWeight: '500',
              fontFamily: 'Public Sans'
            }
          }
        }
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.5,
          gradientToColors: [config.colors.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.6,
          stops: [30, 70, 100]
        }
      },
      stroke: {
        dashArray: 5
      },
      grid: {
        padding: {
          top: -35,
          bottom: -10
        }
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              height: '350px'
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof scoreChartEl !== undefined && scoreChartEl !== null) {
    const scoreChart = new ApexCharts(scoreChartEl, scoreChartOptions);
    scoreChart.render();
  }

  // Total Revenue Report Chart - Bar Chart
  // --------------------------------------------------------------------
  const totalRevenueChartEl = document.querySelector('#totalRevenueChart'),
    totalRevenueChartOptions = {
      series: [
        {
          name: '2021',
          data: [18, 7, 15, 29, 18, 12, 9]
        },
        {
          name: '2020',
          data: [-13, -18, -9, -14, -5, -17, -15]
        }
      ],
      chart: {
        height: 300,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 8,
          startingShape: 'rounded',
          endingShape: 'rounded'
        }
      },
      colors: [config.colors.primary, config.colors.info],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 6,
        lineCap: 'round',
        colors: [cardColor]
      },
      legend: {
        show: true,
        horizontalAlign: 'left',
        position: 'top',
        markers: {
          height: 8,
          width: 8,
          radius: 12,
          offsetX: -3
        },
        labels: {
          colors: legendColor
        },
        itemMargin: {
          horizontal: 10
        }
      },
      grid: {
        borderColor: borderColor,
        padding: {
          top: 0,
          bottom: -8,
          left: 20,
          right: 20
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        }
      },
      responsive: [
        {
          breakpoint: 1700,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '35%'
              }
            }
          }
        },
        {
          breakpoint: 1440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 12,
                columnWidth: '43%'
              }
            }
          }
        },
        {
          breakpoint: 1300,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '45%'
              }
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '37%'
              }
            }
          }
        },
        {
          breakpoint: 1040,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 12,
                columnWidth: '45%'
              }
            }
          }
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 12,
                columnWidth: '33%'
              }
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '28%'
              }
            }
          }
        },
        {
          breakpoint: 640,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '30%'
              }
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '38%'
              }
            }
          }
        },
        {
          breakpoint: 440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 380,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 9,
                columnWidth: '60%'
              }
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof totalRevenueChartEl !== undefined && totalRevenueChartEl !== null) {
    const totalRevenueChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions);
    totalRevenueChart.render();
  }

  // Growth Chart - Radial Bar Chart
  // --------------------------------------------------------------------
  const growthChartEl = document.querySelector('#growthChart'),
    growthChartOptions = {
      series: [78],
      labels: ['Growth'],
      chart: {
        height: 240,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '55%'
          },
          track: {
            background: cardColor,
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: 15,
              color: legendColor,
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: 'Public Sans'
            },
            value: {
              offsetY: -25,
              color: headingColor,
              fontSize: '22px',
              fontWeight: '500',
              fontFamily: 'Public Sans'
            }
          }
        }
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.5,
          gradientToColors: [config.colors.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.6,
          stops: [30, 70, 100]
        }
      },
      stroke: {
        dashArray: 5
      },
      grid: {
        padding: {
          top: -35,
          bottom: -10
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof growthChartEl !== undefined && growthChartEl !== null) {
    const growthChart = new ApexCharts(growthChartEl, growthChartOptions);
    growthChart.render();
  }
})();
