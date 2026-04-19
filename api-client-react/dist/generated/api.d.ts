import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ErrorResponse, GenerateTop5Response, HealthStatus, Instrument, MarketSummary, SessionResponse, Signal, StartSessionBody, TradeDecision, UploadScanBody, UploadScanResponse, WatchlistResponse } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get today's top trading signals
 */
export declare const getListSignalsUrl: () => string;
export declare const listSignals: (options?: RequestInit) => Promise<Signal[]>;
export declare const getListSignalsQueryKey: () => readonly ["/api/signals"];
export declare const getListSignalsQueryOptions: <TData = Awaited<ReturnType<typeof listSignals>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSignals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSignals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSignalsQueryResult = NonNullable<Awaited<ReturnType<typeof listSignals>>>;
export type ListSignalsQueryError = ErrorType<unknown>;
/**
 * @summary Get today's top trading signals
 */
export declare function useListSignals<TData = Awaited<ReturnType<typeof listSignals>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSignals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single signal by ID
 */
export declare const getGetSignalUrl: (id: number) => string;
export declare const getSignal: (id: number, options?: RequestInit) => Promise<Signal>;
export declare const getGetSignalQueryKey: (id: number) => readonly [`/api/signals/${number}`];
export declare const getGetSignalQueryOptions: <TData = Awaited<ReturnType<typeof getSignal>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSignal>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSignal>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSignalQueryResult = NonNullable<Awaited<ReturnType<typeof getSignal>>>;
export type GetSignalQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single signal by ID
 */
export declare function useGetSignal<TData = Awaited<ReturnType<typeof getSignal>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSignal>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get AI trade decision for a signal
 */
export declare const getGetSignalDecisionUrl: (id: number) => string;
export declare const getSignalDecision: (id: number, options?: RequestInit) => Promise<TradeDecision>;
export declare const getGetSignalDecisionQueryKey: (id: number) => readonly [`/api/signals/${number}/decision`];
export declare const getGetSignalDecisionQueryOptions: <TData = Awaited<ReturnType<typeof getSignalDecision>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSignalDecision>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSignalDecision>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSignalDecisionQueryResult = NonNullable<Awaited<ReturnType<typeof getSignalDecision>>>;
export type GetSignalDecisionQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get AI trade decision for a signal
 */
export declare function useGetSignalDecision<TData = Awaited<ReturnType<typeof getSignalDecision>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSignalDecision>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get full watchlist grouped by category
 */
export declare const getGetWatchlistUrl: () => string;
export declare const getWatchlist: (options?: RequestInit) => Promise<WatchlistResponse>;
export declare const getGetWatchlistQueryKey: () => readonly ["/api/watchlist"];
export declare const getGetWatchlistQueryOptions: <TData = Awaited<ReturnType<typeof getWatchlist>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWatchlist>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWatchlist>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWatchlistQueryResult = NonNullable<Awaited<ReturnType<typeof getWatchlist>>>;
export type GetWatchlistQueryError = ErrorType<unknown>;
/**
 * @summary Get full watchlist grouped by category
 */
export declare function useGetWatchlist<TData = Awaited<ReturnType<typeof getWatchlist>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWatchlist>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get flat list of all watchlist instruments
 */
export declare const getListWatchlistInstrumentsUrl: () => string;
export declare const listWatchlistInstruments: (options?: RequestInit) => Promise<Instrument[]>;
export declare const getListWatchlistInstrumentsQueryKey: () => readonly ["/api/watchlist/instruments"];
export declare const getListWatchlistInstrumentsQueryOptions: <TData = Awaited<ReturnType<typeof listWatchlistInstruments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWatchlistInstruments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listWatchlistInstruments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListWatchlistInstrumentsQueryResult = NonNullable<Awaited<ReturnType<typeof listWatchlistInstruments>>>;
export type ListWatchlistInstrumentsQueryError = ErrorType<unknown>;
/**
 * @summary Get flat list of all watchlist instruments
 */
export declare function useListWatchlistInstruments<TData = Awaited<ReturnType<typeof listWatchlistInstruments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWatchlistInstruments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get overall market sentiment and bias
 */
export declare const getGetMarketSummaryUrl: () => string;
export declare const getMarketSummary: (options?: RequestInit) => Promise<MarketSummary>;
export declare const getGetMarketSummaryQueryKey: () => readonly ["/api/market/summary"];
export declare const getGetMarketSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getMarketSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMarketSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMarketSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMarketSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getMarketSummary>>>;
export type GetMarketSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get overall market sentiment and bias
 */
export declare function useGetMarketSummary<TData = Awaited<ReturnType<typeof getMarketSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMarketSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Start or reset a scan session
 */
export declare const getStartSessionUrl: () => string;
export declare const startSession: (startSessionBody?: StartSessionBody, options?: RequestInit) => Promise<SessionResponse>;
export declare const getStartSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startSession>>, TError, {
        data: BodyType<StartSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startSession>>, TError, {
    data: BodyType<StartSessionBody>;
}, TContext>;
export type StartSessionMutationResult = NonNullable<Awaited<ReturnType<typeof startSession>>>;
export type StartSessionMutationBody = BodyType<StartSessionBody>;
export type StartSessionMutationError = ErrorType<unknown>;
/**
 * @summary Start or reset a scan session
 */
export declare const useStartSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startSession>>, TError, {
        data: BodyType<StartSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startSession>>, TError, {
    data: BodyType<StartSessionBody>;
}, TContext>;
/**
 * @summary Get current session state
 */
export declare const getGetCurrentSessionUrl: () => string;
export declare const getCurrentSession: (options?: RequestInit) => Promise<SessionResponse>;
export declare const getGetCurrentSessionQueryKey: () => readonly ["/api/session/current"];
export declare const getGetCurrentSessionQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentSession>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentSession>>>;
export type GetCurrentSessionQueryError = ErrorType<unknown>;
/**
 * @summary Get current session state
 */
export declare function useGetCurrentSession<TData = Awaited<ReturnType<typeof getCurrentSession>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Upload scan1 or scan2 text file
 */
export declare const getUploadScanUrl: () => string;
export declare const uploadScan: (uploadScanBody: UploadScanBody, options?: RequestInit) => Promise<UploadScanResponse>;
export declare const getUploadScanMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadScan>>, TError, {
        data: BodyType<UploadScanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof uploadScan>>, TError, {
    data: BodyType<UploadScanBody>;
}, TContext>;
export type UploadScanMutationResult = NonNullable<Awaited<ReturnType<typeof uploadScan>>>;
export type UploadScanMutationBody = BodyType<UploadScanBody>;
export type UploadScanMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Upload scan1 or scan2 text file
 */
export declare const useUploadScan: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadScan>>, TError, {
        data: BodyType<UploadScanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof uploadScan>>, TError, {
    data: BodyType<UploadScanBody>;
}, TContext>;
/**
 * @summary Merge scans and generate top 5 signals
 */
export declare const getGenerateTop5Url: () => string;
export declare const generateTop5: (options?: RequestInit) => Promise<GenerateTop5Response>;
export declare const getGenerateTop5MutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateTop5>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof generateTop5>>, TError, void, TContext>;
export type GenerateTop5MutationResult = NonNullable<Awaited<ReturnType<typeof generateTop5>>>;
export type GenerateTop5MutationError = ErrorType<ErrorResponse>;
/**
 * @summary Merge scans and generate top 5 signals
 */
export declare const useGenerateTop5: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof generateTop5>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof generateTop5>>, TError, void, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map