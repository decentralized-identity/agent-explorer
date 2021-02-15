export const chart1 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  fill: false,
  datasets: [
    {
      label: 'Activity',
      data: [500, 897, 234, 564, 765, 432],
      borderColor: 'rgb(47 89 138 / 80%)',
      fill: false,
      lineTension: 0,
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderWidth: 1,
    },
  ],
  options: {
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
  },
}

export const chart2 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '# of Credentials',
      data: [500, 897, 234, 564, 765, 432],
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderColor: 'rgb(47 89 138 / 80%)',
      borderWidth: 1,
    },
  ],
}

export const chart3 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '# of Identifiers',
      data: [500, 897, 234, 564, 765, 432],
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderColor: 'rgb(47 89 138 / 80%)',
      borderWidth: 1,
    },
  ],
}

export const chart4 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '# of Messages',
      data: [
        {
          x: 200,
          y: 400,
          r: 10,
        },
        {
          x: 400,
          y: 700,
          r: 5,
        },
        {
          x: 900,
          y: 100,
          r: 3,
        },
        {
          x: 543,
          y: 324,
          r: 12,
        },
        {
          x: 767,
          y: 364,
          r: 16,
        },
      ],
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderColor: 'rgb(47 89 138 / 80%)',
      borderWidth: 1,
    },
  ],
}
