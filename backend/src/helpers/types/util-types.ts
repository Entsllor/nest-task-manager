import {Request, Response} from "express";

// If I decide to migrate from express to fastify I will change these definitions;
export type IResponse = Response;
export type IRequest = Request;

export type MaybePromise<T> = Promise<T> | T