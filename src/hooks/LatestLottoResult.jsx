import { useEffect, useState } from "react";
import UseAxios from "./UseAxios";

export default function LatestLottoResult() {
  const { req } = UseAxios();
  const [latestLotto, setLatestLotto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchLatestLotto = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await req('get', 'lotto/latest');
        const lotto = res.data || res;
        setLatestLotto({
          round: lotto.drawRound,
          numbers: lotto.numbers,
          bonusNumber: lotto.bonusNumber,
          date: lotto.drawDate?.split('T')[0]
        });
      } catch (err) {
        setError(err);
        console.error('useLottoLatest 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestLotto();
  }, [req]);

  return { latestLotto, loading, error };
}