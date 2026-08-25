import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Lock, d as CircleCheck, f as ChevronRight, i as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as cn, O as todayISO, _ as Textarea, b as useMe, c as genderLabel, d as Card, g as Sheet, i as PartnerEditor, l as plural, m as Input, n as Page, p as Field, r as PageHeader, u as Button, v as otherId, y as useAppStore } from "./router-BlVNiMgI.mjs";
import { a as format, t as ru } from "../_libs/date-fns.mjs";
import { c as untilAnniversaryLabel, i as daysUntil, o as nextAnniversary, r as daysTogether, t as anniversaryNumber } from "./dates-DLukipNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/us-_rGGA5Iu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsPage() {
	const me = useMe();
	const partners = useAppStore((s) => s.partners);
	const startedAt = useAppStore((s) => s.startedAt);
	const setStartedAt = useAppStore((s) => s.setStartedAt);
	const wishes = useAppStore((s) => s.wishes);
	const plans = useAppStore((s) => s.plans);
	const docs = useAppStore((s) => s.docs);
	const tasks = useAppStore((s) => s.tasks);
	const votes = useAppStore((s) => s.votes);
	const capsules = useAppStore((s) => s.capsules);
	const [capsOpen, setCapsOpen] = (0, import_react.useState)(false);
	const [voteOpen, setVoteOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [dateOpen, setDateOpen] = (0, import_react.useState)(false);
	const together = daysTogether(startedAt);
	const until = daysUntil(nextAnniversary(startedAt));
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const fulfilled = wishes.filter((w) => w.done).length;
	const trips = plans.filter((p) => p.kind === "trip").length;
	const closedPlans = plans.filter((p) => p.closed).length;
	const doneTasks = tasks.filter((t) => t.done).length;
	const openedCaps = capsules.filter((c) => c.openAt <= todayISO()).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: me.name,
			title: "Мы",
			avatar: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					onClick: () => setCapsOpen(true),
					className: "flex items-center gap-3 px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-full bg-chip text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
							className: "size-5",
							strokeWidth: 1.7
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[17px] font-bold",
							children: "Капсулы"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[13px] text-muted",
							children: "написать письмо в будущее"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					onClick: () => setVoteOpen(true),
					className: "flex items-center gap-3 px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-full bg-chip text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							className: "size-5",
							strokeWidth: 1.7
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[17px] font-bold",
							children: "Голосование"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[13px] text-muted",
							children: "спросить партнёра тайно"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 overflow-hidden rounded-card bg-surface shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[40px] font-extrabold leading-none tracking-tight tabular",
							children: together
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[12px] leading-snug text-muted",
							children: [
								plural(together, "день", "дня", "дней"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"вместе"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l border-line px-5 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[40px] font-extrabold leading-none tracking-tight text-danger tabular",
							children: until
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[12px] leading-snug text-muted",
							children: untilAnniversaryLabel(startedAt)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-card bg-surface px-5 py-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] font-medium uppercase tracking-[0.12em] text-muted",
							children: [
								"Наш ",
								year,
								"-й"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[14px] font-semibold text-link",
							children: "Смотреть"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: fulfilled,
								label: "хотелок исполнено"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: trips,
								label: "поездки вдвоём"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: closedPlans,
								label: "плана закрыто"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: docs.length,
								label: "файлов добавлено"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 overflow-hidden rounded-card bg-surface px-2 py-5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: doneTasks,
							label: "задач сделано"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: votes.length,
							label: "голосований"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: openedCaps,
							label: "капсул открыто"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 px-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted",
					children: "Профили"
				}),
				["a", "b"].map((id) => {
					const p = partners[id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						onClick: () => setEditing(id),
						className: "flex items-center gap-3 px-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-12 rounded-full",
								style: { background: p.color }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[17px] font-bold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[13px] text-muted",
									children: [genderLabel(p.gender), p.birthday ? ` · ${format(/* @__PURE__ */ new Date(p.birthday + "T12:00:00"), "d MMMM", { locale: ru })}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-faint" })
						]
					}, id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					onClick: () => setDateOpen(true),
					className: "px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] font-medium uppercase tracking-[0.1em] text-muted",
							children: "Вместе с"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[17px] font-bold",
							children: format(/* @__PURE__ */ new Date(startedAt + "T12:00:00"), "d MMMM yyyy", { locale: ru })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[13px] text-muted",
							children: anniversaryNumber(startedAt) === 0 ? "Скоро первая годовщина" : `Скоро ${untilAnniversaryLabel(startedAt)}`
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsulesSheet, {
			open: capsOpen,
			onOpenChange: setCapsOpen
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VotesSheet, {
			open: voteOpen,
			onOpenChange: setVoteOpen
		}),
		editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerEditor, {
			open: true,
			partnerId: editing,
			onOpenChange: (v) => !v && setEditing(null)
		}, editing) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: dateOpen,
			onOpenChange: setDateOpen,
			title: "Дата начала",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-4",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					const v = String(fd.get("started") || "");
					if (v) {
						setStartedAt(v);
						toast("Дату обновили — календарь пересчитается");
						setDateOpen(false);
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "С какого дня вы вместе",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						name: "started",
						defaultValue: startedAt,
						required: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Сохранить"
				})]
			})
		})
	] });
}
function Stat({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[28px] font-extrabold leading-none tabular",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-[11px] leading-snug text-muted",
			children: label
		})]
	});
}
function CapsulesSheet({ open, onOpenChange }) {
	const capsules = useAppStore((s) => s.capsules);
	const partners = useAppStore((s) => s.partners);
	const [compose, setCompose] = (0, import_react.useState)(false);
	const [reading, setReading] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
			open: open && !compose && !reading,
			onOpenChange,
			title: "Капсулы",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-[14px] leading-relaxed text-muted",
					children: "Письмо, которое откроется только в выбранный день."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: capsules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-center text-[14px] text-muted",
						children: "Пока пусто"
					}) : capsules.map((c) => {
						const locked = c.openAt > todayISO();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (locked) {
									toast("Ещё рано — капсула откроется в свой день");
									return;
								}
								setReading(c);
							},
							className: "flex items-center gap-3 rounded-card bg-surface px-3 py-3 text-left shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-10 items-center justify-center rounded-full bg-chip",
								children: locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-bold",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[12px] text-muted",
									children: [
										locked ? "откроется" : "можно читать",
										" ",
										format(/* @__PURE__ */ new Date(c.openAt + "T12:00:00"), "d MMMM yyyy", { locale: ru }),
										" · ",
										partners[c.authorId].name
									]
								})]
							})]
						}, c.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5",
					onClick: () => setCompose(true),
					children: "Написать капсулу"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposeCapsule, {
			open: compose,
			onOpenChange: setCompose
		}),
		reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
			open: true,
			onOpenChange: (v) => !v && setReading(null),
			title: reading.title,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap text-[16px] leading-relaxed",
				children: reading.body
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-[13px] text-muted",
				children: [
					partners[reading.authorId].name,
					" ·",
					" ",
					format(new Date(reading.createdAt), "d MMMM yyyy", { locale: ru })
				]
			})]
		}) : null
	] });
}
function ComposeCapsule({ open, onOpenChange }) {
	const addCapsule = useAppStore((s) => s.addCapsule);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [openAt, setOpenAt] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle("");
		setBody("");
		setOpenAt("");
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: "Письмо в будущее",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim() || !body.trim() || !openAt) return;
				addCapsule({
					title,
					body,
					openAt
				});
				toast("Капсулу запечатали");
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Название",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Открыть",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: openAt,
						min: todayISO(),
						onChange: (e) => setOpenAt(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Письмо",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						rows: 6,
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Запечатать"
				})
			]
		})
	});
}
function VotesSheet({ open, onOpenChange }) {
	const votes = useAppStore((s) => s.votes);
	const [compose, setCompose] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
			open: open && !compose && !active,
			onOpenChange,
			title: "Голосование",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-[14px] leading-relaxed text-muted",
					children: "Ответ партнёра откроется только после вашего голоса. Никто никого не торопит."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: votes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-center text-[14px] text-muted",
						children: "Вопросов пока нет"
					}) : votes.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteRow, {
						vote: v,
						onOpen: () => setActive(v.id)
					}, v.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5",
					onClick: () => setCompose(true),
					children: "Задать вопрос"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposeVote, {
			open: compose,
			onOpenChange: setCompose
		}),
		active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteDetail, {
			voteId: active,
			onClose: () => setActive(null)
		}) : null
	] });
}
function VoteRow({ vote, onOpen }) {
	const me = useAppStore((s) => s.currentId);
	const partner = useAppStore((s) => s.partners[otherId(s.currentId)]);
	const mine = vote.ballots[me] !== void 0;
	const theirs = vote.ballots[otherId(me)] !== void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		className: "rounded-card bg-surface px-4 py-3 text-left shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold leading-snug",
			children: vote.question
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[12px] text-muted",
			children: !mine ? "Вы ещё не голосовали" : theirs ? "Оба ответили — можно смотреть" : `Ждём ${partner.name}`
		})]
	});
}
function VoteDetail({ voteId, onClose }) {
	const vote = useAppStore((s) => s.votes.find((v) => v.id === voteId));
	const me = useAppStore((s) => s.currentId);
	const partners = useAppStore((s) => s.partners);
	const castVote = useAppStore((s) => s.castVote);
	const deleteVote = useAppStore((s) => s.deleteVote);
	if (!vote) return null;
	const mine = vote.ballots[me];
	const partnerId = otherId(me);
	const theirs = vote.ballots[partnerId];
	const revealed = mine !== void 0 && theirs !== void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open: true,
		onOpenChange: (v) => !v && onClose(),
		title: "Вопрос",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[20px] font-extrabold leading-snug",
				children: vote.question
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-col gap-2",
				children: vote.options.map((opt, i) => {
					const chosen = mine === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: mine !== void 0,
						onClick: () => {
							castVote(vote.id, i);
							toast(theirs !== void 0 ? "Голос учтён — ответы открыты" : "Голос сохранён. Ответ партнёра откроется, когда проголосует и он.");
						},
						className: cn("rounded-card px-4 py-3 text-left text-[15px] font-semibold", chosen ? "bg-ink text-on-ink" : "bg-chip text-ink", mine !== void 0 && !chosen && "opacity-50"),
						children: opt
					}, opt + i);
				})
			}),
			mine === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-[13px] leading-relaxed text-muted",
				children: [
					"Ответ ",
					partners[partnerId].name,
					" скрыт, пока вы не выберете свой."
				]
			}) : !revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-[13px] leading-relaxed text-muted",
				children: [
					"Вы проголосовали. ",
					partners[partnerId].name,
					" ещё нет — подсмотреть нельзя."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-card bg-surface p-4 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] font-semibold uppercase tracking-[0.1em] text-muted",
						children: "Открыто"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[15px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold",
								children: [partners[me].name, ":"]
							}),
							" ",
							vote.options[mine]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[15px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold",
								children: [partners[partnerId].name, ":"]
							}),
							" ",
							vote.options[theirs]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[13px] text-muted",
						children: mine === theirs ? "Совпало." : "Разъехались — можно обсудить."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-4",
				onClick: () => {
					deleteVote(vote.id);
					onClose();
				},
				children: "Удалить вопрос"
			})
		]
	});
}
function ComposeVote({ open, onOpenChange }) {
	const addVote = useAppStore((s) => s.addVote);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [o1, setO1] = (0, import_react.useState)("");
	const [o2, setO2] = (0, import_react.useState)("");
	const [o3, setO3] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setQuestion("");
		setO1("");
		setO2("");
		setO3("");
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: "Новый вопрос",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				const options = [
					o1,
					o2,
					o3
				].map((s) => s.trim()).filter(Boolean);
				if (!question.trim() || options.length < 2) {
					toast("Нужны вопрос и хотя бы два варианта");
					return;
				}
				addVote({
					question,
					options
				});
				toast("Вопрос задан");
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Вопрос",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: question,
						onChange: (e) => setQuestion(e.target.value),
						placeholder: "Куда поедем?",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Вариант 1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: o1,
						onChange: (e) => setO1(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Вариант 2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: o2,
						onChange: (e) => setO2(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Вариант 3 — необязательно",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: o3,
						onChange: (e) => setO3(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Спросить"
				})
			]
		})
	});
}
//#endregion
export { UsPage as component };
