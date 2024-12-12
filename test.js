import http from 'k6/http';
import { check, sleep} from 'k6';
import { Trend, Rate } from 'k6/metrics';

const API_URL = 'https://test.k6.io';

let responseTimeTrend = new Trend('response_time');
let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '5m', target: 500 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'errors': ['rate<0.01'],
  },
};

export default function () {
  let res = http.get(API_URL);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  responseTimeTrend.add(res.timings.duration);
  errorRate.add(res.status !== 200);

  sleep(1);
}
