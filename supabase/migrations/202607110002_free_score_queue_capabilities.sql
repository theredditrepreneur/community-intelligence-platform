create extension if not exists pgmq cascade;
create extension if not exists pg_cron cascade;

do $$
begin
  if not exists (select 1 from pgmq.list_queues() where queue_name = 'community-score-jobs') then
    perform pgmq.create('community-score-jobs');
  end if;
end
$$;

comment on extension pgmq is 'Durable queue for Free Community Intelligence Score processing.';
comment on extension pg_cron is 'Scheduling capability for Free Score workers and retention cleanup. Schedules are configured only after worker URLs and secrets are approved.';
